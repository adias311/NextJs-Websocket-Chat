import { db } from './db';


export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
}

async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          { memberOne_Id: memberOneId },
          { memberTwo_Id: memberTwoId }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    });

  } catch (error) {
    console.log(error);
    return null;
  }
}

async function createNewConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.create({
      data: {
        memberOne_Id: memberOneId,
        memberTwo_Id: memberTwoId
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    });

  } catch (error) {

    console.error(error);
    return null;
  }

}