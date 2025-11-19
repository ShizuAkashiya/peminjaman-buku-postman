import express from "express"
const app = express();
app.use(express.json());

let currentSession = null;

function requireLogin(req, res, next) {
    if(!currentSession) {
        return res.status(401).json({error: "Harus login dulu kak"})
    }
    req.user = currentSession
    next();
}

app.post("/login", (req, res) => {
    const {id} = req.body;

    const user = users.find(u => u.id == id)
    if (!user) return res.status(404).json({error: "User tidak ditemukan"})
    
    currentSession = user;

    res.json({message: "Login berhasil", user})
})
//function supaya checkrole nya gampang
function checkRole(role) {
    return (req, res, next) => {
        const userRole = req.headers.role
        if (!userRole) {
            return res.status(403).json({error: "Role diperlukan kak"})
        }
        if (userRole !== role) {
            return res.status(403).json({error: "kakak gak punya aksesnya, minta kak asherah"})
        }
        next()
    }
}

let users = [
    {id: 1, nama: "Agus", role: "student"},
    {id: 2, nama: "Asherah", role: "admin"}
]

app.get("/users", (req, res) => {
    res.json(users);
})

app.post("/users", (req, res) => {
   const newUser = {
    id: users.length + 1,
    name: req.body.name,
    role: req.body.role
   }
   users.push(newUser)
   res.json(newUser)
})

//bukubuku
let bukubuku = [
    {
        id: 1,
        title: "Voynich Manuscript",
        ISBN: "9780997123104",
        isPinjam: false,
        dipinjamkanOleh: null
    }
]


app.get("/buku", requireLogin, checkRole("admin", "student"), (req, res) => {
    res.json(buku);
})

app.get("/buku/:id", requireLogin, checkRole ("admin", "student"), (req,res) => {
    const buku = bukubuku.find(b => b.id == req.params.id);
    if (!buku) return res.status(404).json({message: "buku gk ditemukan"})
    res.json(buku);
})

app.post("/buku", requireLogin, checkRole("admin"), (req, res) => {

    const newBuku = {
        id: bukubuku.length + 1,
        jduul: req.body.judul,
        ISBN: req.body.ISBN,
        isPinjam: false,
        dipinjamkanOleh: null
    };

    bukubuku.push(newBuku)
    res.status(201).json({message: "Buku baru sukses ditambahkan", data: newBuku})
})

app.put("/buku/:id", requireLogin, checkRole("admin"), (req, res) => {
    const buku = bukubuku.find(b => b.id == req.params.id)
    if (!buku) return res.status(404).json({message: "Buku gk ditemukan"})
    
    buku.title = req.body.title || buku.title
    buku.ISBN = req.body.ISBN || buku.ISBN

    res.json({message: "Buku sukses di update", data: buku})
})

app.delete("/buku/:id", requireLogin, checkRole("admin"), (req,res) => {
    const index = buku.findIndex(b => b.id == req.params.id)

    if (index === -1)
        return res.status(404).json({message: "buku tidak ada"})

    const removed = bukubuku.splice(index, 1)

    res.json({message: "buku sukses di hancurkan/terbuang", data:removed[0]})
})

app.post("/buku/:id/pinjam", requireLogin, checkRole("student"), (req, res) => {
    const {userid} = req.body;
    const buku = bukubuku.find(b => b.id == req.params.id)
    const user = users.find(u => u.id == userid)

    if (!buku) return res.status(404).json({message: "buku gk ditemukan"})
    if (!user) return res.status(404).json({message: "user gk ditemukan"})
    if (!buku.isPinjam) return res.status(404).json({message: "buku sudah di pinjam"})
    
    buku.isPinjam = true;
    buku.dipinjamkanOleh = userid;

    res.json({message: "berhasil di pinjamkan", buku});
})



app.put("/buku/:id/kembali", requireLogin, checkRole("student"), (req, res) => {
    const buku = bukubuku.find(b => b.id == req.params.id)

    if(!buku) return res.status(404).json({message:"buku gk ada"})
    if (!buku.isPinjam) return res.status(404).json({message: "buku belom di pinjam"})
    
    buku.isPinjam = false;
    buku.dipinjamkanOleh = null;
    
    res.json({message: "buku berhasil dikembalikan", buku})
})

app.listen(3000, () => console.log("server jalan di sini kak: http://localhost:3000"))