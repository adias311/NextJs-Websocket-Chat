program BubbleSort;

uses crt;

var
  L: array[1..100] of integer;
  i, j, n, temp: integer;

begin
  clrscr;
  write('Berapa jumlah elemen array ? '); 
  readln(n);

  for i := 1 to n do
  begin
    write('L[', i, '] = ');
    readln(L[i]);
  end;

  writeln('Proses Pengurutan Bubble Sort: ');

  for i := 1 to n - 1 do
  begin
    for j := n downto i + 1 do
    begin
      if L[j] < L[j - 1] then
      begin
        temp := L[j];
        L[j] := L[j - 1];
        L[j - 1] := temp;
      end;
    end;
  end;

  {cetak array tiap langkah pengurutan}

  writeln;
  writeln;
  write('Hasil Pengurutan Bubble Sort : ');

  for i := 1 to n do
  begin
    write(L[i], ' ');
  end;

  readln;
end.
