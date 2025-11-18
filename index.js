import express from "express";
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "Ashe", role: "admin" },
  { id: 2, name: "Ucup", role: "student" }
];

let buku = [
  { book_id: 1, judul: "Rohonc Codex", isPinjam: false, dipinjamOleh: null },
  { book_id: 2, judul: "Voynich Manuscript", isPinjam: false, dipinjamOleh: null }
];

let member = [
  { id: 1, nama: "Ashe" },
  { id: 2, nama: "Ucup" }
];

function checkRole(roles) {
  return (req, res, next) => {
    const role = req.headers.role; // kirim di header: role: admin atau student

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    next();
  };
}


app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const { name, role } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    role
  };

  users.push(newUser);

  res.status(201).json({ message: "User baru dibuat", data: newUser });
});



app.get("/buku", checkRole(["admin", "student"]), (req, res) => {
  res.json(buku);
});


app.get("/buku/:id", checkRole(["admin", "student"]), (req, res) => {
  const item = buku.find(b => b.book_id == req.params.id);
  if (!item) return res.status(404).json({ message: "Buku tidak ditemukan" });
  res.json(item);
});


app.post("/buku", checkRole(["admin"]), (req, res) => {
  const { judul } = req.body;

  const newBuku = {
    book_id: buku.length + 1,
    judul,
    isPinjam: false,
    dipinjamOleh: null
  };

  buku.push(newBuku);
  res.status(201).json({ message: "Buku baru ditambahkan", data: newBuku });
});

app.put("/buku/:id", checkRole(["admin"]), (req, res) => {
  const item = buku.find(b => b.book_id == req.params.id);
  if (!item) return res.status(404).json({ message: "Buku tidak ditemukan" });

  const { judul } = req.body;

  item.judul = judul || item.judul;

  res.json({ message: "Buku berhasil diupdate", data: item });
});


app.delete("/buku/:id", checkRole(["admin"]), (req, res) => {
  const index = buku.findIndex(b => b.book_id == req.params.id);

  if (index === -1)
    return res.status(404).json({ message: "Buku tidak ditemukan" });

  const removed = buku.splice(index, 1);

  res.json({ message: "Buku dihapus", data: removed[0] });
});


app.put("/buku/:id/pinjam", checkRole(["student"]), (req, res) => {
  const item = buku.find(b => b.book_id == req.params.id);
  const { member } = req.body; // tetap sama seperti skrip asli

  if (!item) return res.status(404).json({ message: "Buku gk ditemukan" });
  if (item.isPinjam)
    return res.status(400).json({ message: "Buku sudah dipinjam" });

  item.isPinjam = true;
  item.dipinjamOleh = member;

  res.json({ message: "Buku berhasil dipinjam", data: item });
});


app.put("/buku/:id/kembali", checkRole(["student"]), (req, res) => {
  const item = buku.find(b => b.book_id == req.params.id);

  if (!item) return res.status(404).json({ message: "Buku gk ditemukan" });
  if (!item.isPinjam)
    return res.status(400).json({ message: "Buku belum dipinjam" });

  item.isPinjam = false;
  item.dipinjamOleh = null;

  res.json({ message: "Buku dikembalikan", data: item });
});

app.listen(3000, () =>
  console.log("Server jalan di sini kak: http://localhost:3000")
);
