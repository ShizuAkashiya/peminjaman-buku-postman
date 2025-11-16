import express from "express";
const app = express();

app.use(express.json());


let buku = [
  { id: 1, judul: "Rohonc Codex", isPinjam: false, dipinjamOleh: null },
  { id: 2, judul: "Voynich Manuscript", isPinjam: false, dipinjamOleh: null }
];


let member = [
  { id: 1, nama: "Ashe" },
  { id: 2, nama: "Ucup" }
];


app.get("/buku", (req, res) => {
  res.json(buku);
});


app.get("/buku/:id", (req, res) => {
  const item = buku.find(b => b.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Buku tidak ditemukan" });
  res.json(item);
});


app.post("/buku", (req, res) => {
  const { judul } = req.body;

  const newBuku = {
    id: buku.length + 1,
    judul,
    isPinjam: false,
    dipinjamOleh: null
  };

  buku.push(newBuku);
  res.status(201).json({ message: "Buku baru ditambahkan", data: newBuku });
});


app.put("/buku/:id/pinjam", (req, res) => {
  const item = buku.find(b => b.id == req.params.id);
  const { member } = req.body;

  if (!item) return res.status(404).json({ message: "Buku gk ditemukan" });
  if (item.isPinjam === true)
    return res.status(400).json({ message: "Buku sudah dipinjam" });

  item.isPinjam = true;
  item.dipinjamOleh = member;

  res.json({ message: "Buku berhasil dipinjam", data: item });
});


app.put("/buku/:id/kembali", (req, res) => {
  const item = buku.find(b => b.id == req.params.id);

  if (!item) return res.status(404).json({ message: "Buku gk ditemukan" });
  if (item.isPinjam === false)
    return res.status(400).json({ message: "Buku belum dipinjam" });

  item.isPinjam = false;
  item.dipinjamOleh = null;

  res.json({ message: "Buku dikembalikan", data: item });
});


app.delete("/buku/:id", (req, res) => {
  const index = buku.findIndex(b => b.id == req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Buku gk ditemukan" });

  const removed = buku.splice(index, 1);

  res.json({ message: "Buku dihancurkan/dibuang", data: removed[0] });
});


app.get("/member", (req, res) => {
  res.json(member);
});

app.post("/member", (req, res) => {
  const { nama } = req.body;

  const newMember = {
    id: member.length + 1,
    nama
  };

  member.push(newMember);

  res.status(201).json({
    message: "Member baru ditambahkan",
    data: newMember
  });
});

app.listen(3000, () => console.log("Server jalan kak di: http://localhost:3000"));