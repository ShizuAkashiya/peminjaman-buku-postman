import express from "express";
const app = express();
app.use(express.json());


//Iki role check supaya gak pake if terus
function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.headers.role;
    if (!userRole) {
      return res.status(403).json({ error: "Role diperlukan" });
    }
    if (userRole !== role) {
      return res.status(403).json({ error: "kakak gak punya aksesnya, minta kak asherah" });
    }
    next();
  };
}

//Ini penggunanya
let users = [
  { id: 1, name: "Agus", role: "student" },
  { id: 2, name: "Asherah", role: "admin" }
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    role: req.body.role
  };
  users.push(newUser);
  res.json(newUser);
});


//Bukuku
let bukubuku = [
  { 
    id: 1, 
    title: "Codex of Eternity", 
    isbn: "200073004",
    isPinjam: false,
    dipinjamOleh: null
  }
];

app.get("/buku", checkRole("admin"), (req, res) => {
  res.json(bukubuku);
});

app.get("/buku/:id", checkRole("admin"), (req, res) => {
  const buku = bukubuku.find(b => b.id == req.params.id);
  res.json(buku || { error: "not found" });
});

app.post("/buku", checkRole("admin"), (req, res) => {
  const newBuku = {
    id: bukubuku.length + 1,
    title: req.body.title,
    isbn: req.body.isbn,
    isPinjam: false,
    dipinjamOleh: null
  };
  bukubuku.push(newBuku);
  res.json(newBuku);
});

app.put("/buku/:id", checkRole("admin"), (req, res) => {
  const buku = bukubuku.find(b => b.id == req.params.id);
  if (!buku) return res.json({ error: "not found" });

  buku.title = req.body.title || buku.title;
  buku.isbn = req.body.isbn || buku.isbn;

  res.json(buku);
});

app.delete("/buku/:id", checkRole("admin"), (req, res) => {
  const index = bukubuku.findIndex(b => b.id == req.params.id);
  if (index === -1) return res.json({ error: "Gak ketemu kak" });

  bukubuku.splice(index, 1);
  res.json({ message: "buku terbuang/terhancurkan" });
});

app.post("/buku/:id/pinjam", checkRole("student"), (req, res) => {
  const {userid} = req.body;

  const buku = bukubuku.find(b => b.id == req.params.id);
  const user = users.find(u => u.id == userid);

  if (!buku) return res.json({ error: "buku not found" });
  if (!user) return res.json({ error: "user not found" });
  if (buku.isPinjam) return res.json({ error: "buku sudah dipinjam" });

  buku.isPinjam = true;
  buku.dipinjamOleh = userid;

  res.json({ message: "berhasil dipinjam", buku });
});

app.post("/buku/:id/kembali", checkRole("student"), (req, res) => {
  const buku = bukubuku.find(b => b.id == req.params.id);

  if (!buku) return res.json({ error: "buku not found" });
  if (!buku.isPinjam) return res.json({ error: "buku belum dipinjam" });

  buku.isPinjam = false;
  buku.dipinjamOleh = null;

  res.json({ message: "berhasil dikembalikan", buku });
});

app.listen(3000, () =>
  console.log("Server jalan di sini kak: http://localhost:3000")
);
