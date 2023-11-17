import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/type";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";


export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "method not allowed" })
  }

  try {

    const profile = await currentProfilePages(req);
    const { content } = req.body;
    const { serverId, channelId, messageId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!serverId || !channelId || !messageId) {
      return res.status(400).json({ message: "bad request" })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profile_id: profile.id
          }
        }
      },
      include: {
        members: true
      }
    })

    if (!server) {
      return res.status(404).json({ message: "server not found" })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        server_id: serverId as string
      }
    })

    if (!channel) {
      return res.status(404).json({ message: "channel not found" })
    }

    const member = server.members.find(member => member.profile_id === profile.id);

    if (!member) {
      return res.status(404).json({ message: "member not found" })
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channel_id: channelId as string
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })


    if (!message || message.deleted) {
      return res.status(404).json({ message: "message not found" })
    }


    const isMessageOwner = message.member_id === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string
        },
        data: {
          fileUrl: null,
          content: "This message was deleted",
          deleted: true
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      })
    }


    if (req.method === "PATCH") {

      if (!isMessageOwner) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      message = await db.message.update({
        where: {
          id: messageId as string
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      })
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message)

  } catch (error) {
    console.log("MESSAGE_ID", error)
  }

}