SELECT s.slot, s.status, s.usedby, o.idslot, o.id, o.startbook, o.endbook 
FROM orders o JOIN slots s ON s.id=o.idslot 
WHERE s.status = 2 AND o.id = (SELECT x.id FROM orders x WHERE x.idslot = s.id ORDER BY x.startbook DESC LIMIT 1);
// query untuk mencari nilai startbook dan endbook dari tabel slot



SELECT * FROM orders WHERE iduser = 3 ORDER BY iduser DESC LIMIT 1;
update fajar.orders set pictstart = "sbasa" where id = 2;
// kirim gambar ke log