// ==========================================
// KONFIGURASI SUPABASE
// ==========================================
const SUPABASE_URL = "https://iojbgkyvjxxtvciqpmst.supabase.co"; // Ganti dengan URL Supabase kamu
const SUPABASE_KEY = "sb_publishable_a4ScDCfEIbYfqabbYWVWvQ_hlfOO2_i";   // Ganti dengan anon public key kamu

var dbSupabase;
try {
    dbSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (err) {
    console.error("Gagal koneksi Supabase:", err);
}

const PASSWORD_KASIR = "1234";
let keranjang = [];

// TAMBAHAN FITUR: Setiap barang punya properti 'gambar' (URL Image)
// ==========================================
// DAFTAR PRODUK BESERTA GAMBAR DARI INTERNET / ASSET
// ==========================================
const daftarProduk = [
    // --- KATEGORI: ALAT TULIS & BUKU ---
    { 
        id: 1, 
        nama: "Penggaris", 
        harga: 3000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl7kGYLMHAF3eyM9tr2BbFX374Hw5PQdfKxPZC23cmCQ&s=10" 
    },
    { 
        id: 2, 
        nama: "Busur Derajat (Kecil)", 
        harga: 1500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHqJN0ggEfTYVNNE5xFyKfFflpKFXpEnJE_0KSjCEL8A&s=10" 
    },
    { 
        id: 3, 
        nama: "Busur Derajat (Plastik/Sedang)", 
        harga: 1000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB3iiqntQxQlshIGoXlaKPB9g3G05e6khBTQjHHa0q5g&s=10" 
    },
    { 
        id: 4, 
        nama: "Jangka", 
        harga: 8000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSySE_6cG7-fHE_zdEh99Q5fGpu6hRjFyPTUJcas9-MiSdYWEb85DldukE&s=10" 
    },
    { 
        id: 5, 
        nama: "Buku Tulis Bigboss", 
        harga: 6000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGqkFHJtYYKh1pa7vUQbrtLPDDKMm1m62vzMwh3EvgIg&s=10"
    },
    { 
        id: 6, 
        nama: "Buku Tulis Glatik", 
        harga: 2500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqjzqNMWRu50kMhZq-ejGN9o71atV9l0QjfGL_GBL1RQ&s=10" 
    },
    { 
        id: 7, 
        nama: "Buku Tulis Sidu (38)", 
        harga: 4500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS743HX9tjWng0u6oE8q19yFr2RWohHFbn3aiuhp42oiA&s" 
    },
    { 
        id: 8, 
        nama: "Buku Tulis Sidu (32)", 
        harga: 4000, 
        kategori: "Alat Tulis",
        gambar: "data:image/webp;base64,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" 
    },
    { 
        id: 9, 
        nama: "Pensil 2B Staedtler", 
        harga: 3500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuApdh5y3sJA__lud3BgU4zLuUhTefYxrbANrUNLjt1A&s=10"
    },
    { 
        id: 10, 
        nama: "Spidol Snowman", 
        harga: 12000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2oUiCiGuJOKfO0WVZIoQX_IKlV9eoK10_HxFhqcjOyQ&s=10" 
    },
    { 
        id: 11, 
        nama: "Spidol Warna", 
        harga: 2500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAXvl2P8TR_OOl9210C256lt0sfgCh5g09ed-v4NE6tA&s=10" 
    },
    { 
        id: 12, 
        nama: "Penghapus Jersey", 
        harga: 2000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZNBsLD1zeMGV14meEPJMitxzNVy6Gb6Q4nSIiSX70rQ&s=10" 
    },
    { 
        id: 13, 
        nama: "Pulpen Gel", 
        harga: 3500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN_zogq16rRapdmltTRvu8qly1zDC5bYfSTQHn0UuT7w&s=10" 
    },
    { 
        id: 14, 
        nama: "Pulpen Standart", 
        harga: 2000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSZ-aont_FwdVYYlkVRA2SND3MUZ_MvZINB5OsmZpy-w&s" 
    },
    { 
        id: 15, 
        nama: "Pulpen Faster", 
        harga: 3000, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0n7qsz6xwS9xLIaPqSoLkE8L1rnX3F9uFUlB97lXHKg&s=10" 
    },
    { 
        id: 16, 
        nama: "Peraut Pensil", 
        harga: 1500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjvMUN8DAemRW4JV1CGa21RcpgAlywNbHByBKc0IUvvg&s=10" 
    },
    { 
        id: 17, 
        nama: "Buku Gambar A4", 
        harga: 3500, 
        kategori: "Alat Tulis",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCh-aYnRMGjFa1J2rqYKbbuxNj9QBa9DVqkvvUzZWTLQ&s" 
    },

    // --- KATEGORI: KERTAS & PERLENGKAPAN ---
    { 
        id: 18, 
        nama: "Kertas Cover", 
        harga: 1000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdKXyO9522BU3sLDfDelFxU9hfYjaGN1PEoHPSgdz2pw&s=10" 
    },
    { 
        id: 19, 
        nama: "Mika Bening", 
        harga: 750, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKuPAnVSjrehZNXhLHIEoVPv9TCEU_8yTqdtmn7j94sw&s=10" 
    },
    { 
        id: 20, 
        nama: "Kertas HVS (5 Lembar)", 
        harga: 2000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSExITFhUVGBUXFxUVFRYXFRcXFRcYFxgVGBUYHSggHRolGxcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lHyUvLS0tLS0tLS0tLS0tLS0tLS0vLS0tLS0uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAAcBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xABREAABAwICBAgGDQYOAwAAAAABAAIRAwQSIQUGMUEHEyJRYXGBkTJUobHB0RQVFiNSU2JykpOys9IkNUJzotMXJTNDRGNkdIKDlMLh8TSj8P/EABsBAQADAQEBAQAAAAAAAAAAAAABAwQCBgUH/8QANhEAAgECAwQHBwQDAQEAAAAAAAECAxEEEjEFIVFSExQVMkFxoSI0YYGRsdEzQuHwIyTBsoL/2gAMAwEAAhEDEQA/AO4oAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAo3V0yk0vqPaxoiXPcGtE5CSclKi5OyFzHO1psRtvbT/UUvxKzoKvK/oyMy4kh1u0f49afX0vxLrq1bkf0ZGZcSU646P8etPr6frTqtbkf0YzLiQOuWjx/TrX65m/tTqtbkf0Yzx4kp110f47QPU8HzLrqdfkf0GePEpO170cP6XT7A8+YKVgcQ/2MZ48ST+EDRvjTexlU/7V12fieT7EZ48SmeEbRvjJ7KNc/wCxddm4rl9V+R0kST+ErRvx9T/T3H7tT2XieX1X5HSRJXcJmjRlx9T/AE9x+7UdmYnl9V+RniBwmaNOytV/01x+7Ts3E8vqvyOkiDwlaP8AjKv1FX0tTs3Ecvqh0kSU8Jlh8Kt9S9OzcRw9UOkiSHhOseauf8v1lStmV/h9R0kSU8KFn8C4+gz8a67Lr/D6kdJEkdwp2fxVz9Cn+8U9lVuK+v8AA6VGxasaw076matJtRrWuLOWGgyAJ8EnnjsWOvh5UJZZHUZZjMKk6CAIAgCAIAgCAIAgCA1XhPMaOrHmNL71i27O94j8/sV1e6cKNHHsXrlE+VPGdG/aRb17ct8IEDn2jvClF9LE06ndZKKJiQJHOpLVOLdrlRr4EFuaWFt5dF3JacPaubFd9+pO4hua5ynadyjVugNgUqFyTHVbwzkrlT4nNypQ0luMjpGxcukMxdNugdjgq3TsdXJfZTfjG96jJ8AVmhx2OBXDcfEEwx/AJ6gSufZ4kk7i4babx1iPOud3EbwMXwe8qdwAdEkxkC6PNPbChg65wMtjR5PPVcf2KY84K89tT9f5Gil3TfF84sCAIAgCAIAgCAIAgCA1ThS/Ndx/lffU1u2b7zD++BXV7jOGaKrtDm8YCWhwLgDBLZzAO4xK9hNPK1HU+HiIXtLVeJ1z3OWrnMbxEMeA8uDn8kzRApSTEOD3bczuXmOu10m829O3h8d/yNTwVHMvZ3a3v47txqesthb02hvE8Q91FtSGTyHnECA0gkDkgx8rdtX08LUrT3qWZJ28zPUqwp1FmjZtL68DXq+roDjxd0xzGZ1HPHFlrQJ4xjcR4xp3BpxS5uQmVrjiZW9qDu9Lb9/B8PnuNaqQbaT0LLTQps4vinVYcwOioWkiXOaDkBAIaHAZ+FtO1XUHKV81tztu+QjfW2pj2uc7er8qJcrFGuw88qUkgpXLcsXRJDi0BdaKpTXoggEGrSBB2EF7QQexVV3alLyf2Oo6npl1uATDWxzBoXgs8uJusACP+gouwTsc7n8ii4JqgDhBAIO0HMdxUptaA57r9qk1tJ1zbNDcAxVKY8Et3uaNxG0jZHl+xs/HNzVOp46MpqQ3XRzmgwmm9x3kDugr7Un7SRTHedm4ImRo9vTUqegeheb2p7w/JGml3TdV88sCAIAgCAIAgCAIAgCA1nhKbOjLn5jT3PaVs2e/9mHmcVO4zz4w4SCRIDhI5wDmO6V7OSbW4+XG3ibRZ6wF7S003hpOZJDmyDDXAO24WgQ3ZukABYXhGn4GTEOnHx18NS7Ok6bi4mnyjvcA8kNDcjJHMU6vOKST3fQxyqxe9rfuMZx9IgjicsWIcoCREYDAkN2bD0DnFsYVV+7w/rNlWdJxT8TFaRbxjy9x5R27hzAAbAAAABzALVTioxyoUq8tWWLqBG8FWGmNWLKeaFyRI5qHRSMqRcnoVXMc142tIcOtpkeULmUVJNPxJzWN1PCrpA7rX6p/7xfJ7Fw3x+v8FvTsiOFG/wD7P2Uj+NR2Nhvj9f4HTSIO4S9IfDpDqpD0lR2Rhvj9SOmmbBqJr7c3F023uAxwq4sLmtwua5rS/OMi0hp3bYWLH7NpU6TqU/Did06rbszpjmAiCJByI5wdoXwk7bzQcGIw0XUxspvqD9qJPY0L163yUuKX2MS3NnYuDFzTo+nhGwvB68S87tG/WH8jXT7ptawnYQBAEAQBAEAQBAEAQGu8IgnRt30UXnuz9C1YH3mHmjip3WefqEEE85HpXtz4NeTRlmDJVvU+W97KLnkLtK52lco8YurFmUpVjKlFsNxaupFd3RcmSBrjuUOxojJop1KTuZRdFqkW6k6uVbSljqMZMY3NbPNicBPlXFSWWLlwVyUrs65/BDbeM3H/AKvwLzPblXlXqaurx4lVnBLaD+fuT20vwKHtutyr1/J0qESo3grs/jbn6VP8C5e2a/BepPQxMzq7qZa2TzUph7nkEB1RwJaDtDQAAJ54lZMTj61eOWVrfA6jTUdDI6waVba29Su79AckfCecmtHWY8qow9F1qigvE6k7K5w+kDxDicycyekkyvWO2dJGOJ2XgrbGjqXS6r944eheb2n7zL5fY00u6bcsBaEAQBAEAQBAEAQBAEBgNfh/Ft5/d6v2CtOD94h5r7nM+6zzvo5+R7F7lnn8VqX2kasNa5pzE/8AS5itTLhYqUnGWgtq+MAkEZjaMj1JYirS6N2TLYVDiLYORyPrXa0LnBZFIuaVPFHX6Fw5WIgi7NMAbFVmbLYq5Tgcym7L0W1dk+VdJ2LEY6rQhWqRJJYvwVabjMNexxjbDXAmOwLmos0JJeKZ3F2dzuZ4RtHfHP8Aqav4V5HsnFcvqvyb+liBwh2HxlT6qp6lHZWJ4L6odLEieEKx+HU+qcnZeJ4eqHSxLe64RrVo5DarzuGENHaXH0Fdw2VWfesiHVic21q1kr3tQcZDWNPIptnC2d5+E7dPdC+5hMJDDx9nXiUzm5EuXEv6lP70QtDs3Bq2NHUeuqf/AGvXm9o+8y+X2Rppd02hYSwIAgCAIAgCAIAgCAIDDa6NnR94P7PX+7cr8L+tDzX3OZaM82UeQTzR6V7taHxqsc/mZelDmjKYXL3M+TLNGW4kun4HCdhgg+gqY70WU4543WpGiyTKN2IbtuLsU8JjeD35Klu5bSeaGZESC6egT5VGhZ0kYWv4lEhSakSvaFJ0mUHMCm52i2fR3qcxYi90Romrc1BSpMLnHsDRvc47gFRXrwoxzTZ3GLbsjpuh+DWgwA3D3VXb2tJZTHQI5R65HUvgV9r1ZP8Axqy+rNMaKWpmXalWBEexm9jqgPfilZO0MTe+b7HfRxMDprg3YQXWry13xdQy09AdtHbPYtlDa0k7VV80cSpcDmGlLV9Krxb2lr2mHNO0FffpTjOGaLujO924qcdIe3mC5y2aZK0O6cHH5uof5n3r15XaHvMvl9kaqfdRsqxnYQBAEAQBAEAQBAEAQGM1obNndDnoVh303K2j+pHzX3Ieh5lOezfI7171aHyG7SuXejmVQMiA3pEnsXL+JixMqDd7b/gXukKOLD1BcxdkynByUZO5VtaTm7Y6OdcN3LMRKk37P8FXSIJdl0eZRFbjjATjGDzE1s7bMeDuy3hGjnEJXjl4lu0HZIgqT6DmrXsSvEEjmQmnJTipIouQuRK9DtHbdTNANs7drYHGvAdVdvxHY2eZuzvO9eRx2Jdeq34LQ3QjlRU1i1ooWYAqEueRIpsgvI5zJgDpPZK5w2DqYju6cWTKaia0zhOp4uVbPDecVGl30SAPKt72PK26Sv5FfTLgbjofS1K6p8ZRdiGwjY5p+C4bivl1qM6Mss0WqSehrPCPoBtWm26A5dAjEfhUzz/NJB6sS+hszEuE+iej+5XVjdXOS2bPe3u+E+PP6l6KfeSM60O98Hf5ut/mv+8evJ4/3if98DXT7qNjWM7CAIAgCAIAgCAIAgCAsdONm2rjnpVR3sK7pbprzRD0PL2jKktHYv0BHw8QrXMjZ3uZa7sK5kjHVw91niZB1aCAYzAjuVVimlRcoOS8CLncknmj0oTCN5qL8SDX4s53HPqCHbi6W63iUqdSUNbhlZO1QyGtzJbp0OJBzzRI7wyvSSsWj6qmxqirF7q60Purdh2GtSB6sYkKjFNxoza4Mshqj0CvFm88/abvnVrirVcZLnu7ADDW9QAA7F7OhTVOlGK4GOTuy0xK0g27gvvXNvOLB5NRjw4dLBiaesQR/iK+XtWmnQzPVP7ltLU6hptoNtXB2cVVn6BXwKDtVi1xRe9DgVqfeG9LyfKV7Kf6jMcdDvPB+P4utvmedxK8ljveJ+Zrh3UbCsh2EAQBAEAQBAEAQBAEBQv2zSqDnY4fsldR7yB5S0a7CGzzAr9BWh8XEK6djMW1o3wiJPTsXMmfOnXmllW4u7iARMbBB3f9qtFdJzyvL8yAqZEc/oUteJGjTIh0doy6jIUMtjHpFvJWuQ1L4kpchakWd5Ugx0HzFdwRZExpeecq6yLDI6n1j7PtBP8AP0vthZMcv9efkyyn3kekwvCm81N3B7YkkllSSST767aV9FbUxFrXX0OOjiR/g/sPi3/Wv9ajtTE8V9ER0US80TqhaW1UVqVNzXgEAmo93hCDkTGxVVsdWqxyze7yR0oJbzIadMW1f9TV+w5U4f8AVj5omWjOB0zFCl1nzr2Ws2Y1od61A/N1r+qae/NeRx3vE/NmuHdRsCynYQBAEAQBAEAQBAEAQEtUSCOgotQeSdjAOYR3L9DhvVz5Mu8zf+DCk1zqtxWZNO1ZjMiQXEHCADtMAmOfCvlbVqSyxpQ70n6HFPDwjN1paIuOEexaHU7ikPebhgc2BADoBIgZDaD1k8yjZdVuMqU+9FldSlGFZVI92W8vdQdCMpildXYzqvay2pnMuLsuNLTuG0d/wVn2hip1M1Kj4K8n/wANFPDU4zU5eOi/6YbXynhu6oaAAHmABAzzOXatuz23h4tmRZY4movAxNkZxfN9IWuRVXXdtxKTTzwhqlpuLHSZGN0bJMQrYaE4e7hG5bXhbOUbG7OeAulodUVLLv4sr6Iu20KtvXw4jSqh5aDBIa4GJ71VXp9JTlDirHUZNVXw3HUmcLlA7Lat9Kn615x7EqL9y9Tcqy4FR3CrS8Vq/Tb6lHYs+ZE9MuBRPC1S8Uq/TZ6lPYk+dfQnpUTDhYpeK1PrG+pOxZ86+g6X4FHSvCS2rRqUhbOBqsewONQQMbSJgNz2rqlsiUJqTlo76HMqytoc3rO96o/OcP2l9xd5lB6G1D/N1p+pp+ZePxvvE/NmyHdRnllOwgCAIAgCAIAgCAIAgCA8n1KMkxkQT1ZHYV+g0u5F/A+NUnabT0Ogav63ULSypUaIY64e9zq7KjHQ07ANwJgMiCdhXyK+BqYnESnUuorcrHc6zo0lk3mR0nrLSu7OrSuGtp1GlrqIY04SeYbYyJBnc7oVdLBTw+IjOm7xe53Mrxsa1KUZ7mtLElpwgvdUpcbQt8LXNBeGOLmNkYnMzMEDOBzKZ7IioScJO78C2G0JNrOkYXXbTDLq4L6YZgbyWODS1zxtLnzmTMxsyWvZ+GlQpWle71V9PI4q1lUqtrT+6mvh0LayUQLhCWOyxqkErtF8dC2qHcukSbDwd6Ep3d8ylWzpta+oW/DwRDCeaXAnoBWDaWIlQoOUNdy8rltOClLedr0lqxa1qRomhSaIhpYxrXMO4tIGUeXevKUsXWhNTUm/+mpxVrGkcFmibevTrmrRpVS17WgvaHACCeTO4r6u1a9SnKGRtXVyunFO9zePcvZeJ231NP1L5XXMRzy+rLMseBEas2Xidt9TT9Sjrdfnl9WMqMfrLoG1bZ3Dm21BpbRquaW0mAtIYSCCBIIKuw2JrOtBOT1Xi+JE4rKzit2wCjS5xWfPeD5oXqov235Iy+B6E1GH8XWn6il9kLx+M94n5s2Q7qM4sx0EAQBAEAQBAEAQBAEAQHleqPfKg5n1B3PK/QKH6UfJfY+FiO+zarN1cUmEUgWGmGAlrTkZ5QJrAyS+NkZRAAK+dUVLpH7W+9/H8FsMzja24y1kytTMtoQYpt/khhmn0CrBcZzO2dkZqibpzVpT4+L8fkZmqlKTaj6fyWtOjXxEmi2piDGS+ixwAYAAGl1TLbn09Ssk6Vks1tdG/H5CE5S8Pql+THaXpOg8YwMdDTAptp5Zw6GuOfdsWnDuOkXdebf/AAzVpSjWi9DX31to3rYlvN7Vlm8C2e4y0GdokLqxOdWuiS7tiHlo2Tl6k8DqhVzwUmS06cuDNhM7eqVBZKajHMTaO0jWt6ra1Ilr2GQYkcxBGwgiRHSqqtGNSLhPemWwn4o3HS3CXe1qRpYKVIubDqlMOxEOH6MnkyOs80L5lPZNGnPM238H/d5cq2dbjFata2XFi17aPFw8gkPaXZgRlBCvxOCp4hpzvu4EqVtDOs4S74wAKBJ2AUnEnqGNZXsnDrW/1/gdJIjc8IelKeb6TGDnfb1Gjvc6FEdmYSWjb+a/BOeRYX3CLe1mOovNENqNLHYaZBh2Rglx3K2GzKEJKSvdfEiU3YwekTAYJzL2Pj51Ns+ULbB3dyo9D6liLC0/u9H7DV4/F/rz839zXDuozKznQQBAEAQBAEAQBAEAQBAeV7sxWqt5qtYZ9FRwXvsM70YeS+x8XEwedsvbLR/GMLvZNtTMkYar3NduzgMOXqXNarkdskn8Ul+SKMfG6KlxoirQomuK9u9uMU/eXuccRBdscwTkPNzrPTrKVTJladr70vyapwhUW+zRcU9F3DSG1ry3oPIniqhdjE5xULaZYwkGYc6c84RYhNXjBtcUl6b7szVMNh1usr+bKde3qUuNp1G4XtLZGW8EzlkQRBkZZrTTnGajKL3HzqtPLVimYGrTkySrsp9ONTdYi10EdBG0qfA5krp2I6SrhzyRnmc9yi24YWEoQSZRtamFwcZMT5iFDLqlPPFxRcaNtuPr0qM4eNqMp4omMbg2Y3xKpr1MkJT4JsupxtZHU6nBKw/0yoMgP5Ju4R8JfA7blyL6lsMOoLU5mzRD33Zs6ZxP459EHYDgcWl5G4Q0uPQF9p14xo9LLS1xbwO9as6s0LGmG0mgvgY6pAxvPXuHyRkPKvJ4nF1K8rye7h4F0YpGYe0EEEAg7QcwesLMnbejo5Lwm6msoAXdu3DTxNFWmPBbiMNewbgTAI2ZiN69BszHSm+iqa+DKasd10aXprwqcbmUvsz6V9Wlo/MpPRuqbYsbUf1FD7tq8diHetPzf3NkdEZVUkhAEAQBAEAQBAEAQBAEB5Z03THsi6B3XFx5Kr17vCb6MPJfY+TiHaoUdHOk4dp3c57Fok0lvMtaL1ibdcvFCvb0Bgi2OJxcJY6uYfUJzEgOayntHgL5sYupSnUestONtF+fmdOdpqCen3MffW7IqVDcNfUILyAJJcXtkyCR+k4555bNsXUqkt0cjS0+RxNK6d9WS6Yrl9rZPMhzqdVh6WUarm0yeoEt/wAITDLLWqxWl0/m1vLq0F7LMBUkR07OwwtpEOBRa0uMDadiMtuoq7JMfQoLES8YoOzJ6q1Py21/vFDy1WrLi1/gn5P7HcNT0svEms4xqM0HTtaRsqXpHQcbh5iV6THO2Bj/APP2Ko947Dc1MLHO+C1x7hK85FXaRbc59wVa1XN4+u24qB+FrHt5LW4cRcC0YRm3IRMnLavr7UwlKgoumrap/I4pyb1No15H8X3U/EvPaBI8sLDgveIeZNTus4Jf1ZLepo+iwBetirGZHpnVoRZ2w/qKP3bV4qt+pLzf3Ni0MkqyQgCAIAgCAIAgCAIAgCA8w6eH5XeD+03P3ryvc4P9CHkvsfJxPfLXQdcUa4ruaXGmHOptEQawaeLLp/RDocfmhd4mlKrHKnrr5eIp1Yx3MntLyu1weahxBwcDDScQMh0kbZzXXRpxyvTT5GWfRZs0Fv4mbq3NpWc6q/j6T3S6pTpMY9jiTLjTc54LATnBBid4WeMMRTWSNmlo3ufz4/ImTpSabuYfTOk+Pc0tbgpsa2nTZM4GNmATvcSXEneSVow9Lo4tN3bd2/iWz3yLKqZYwCZE+cq05pr22yW1MPDjsB5ujoUN7jurFyg4okDodO6Qd24qGy5U242KVQTuUXO4xsrFxom7FGtSqkE8XVp1IH9W8OI8irqxz05Q4po633Vj05QrNe1r2EOa4BzXDYQRII7F4aUXF2epsMLo7VK1oXVS7pscKtTFMuJaC84nlrdxJ9MQtNTGValJUpPciMqTuVtbNJNtrOvVcdjHBo53uGFjR1khcYWk6taMVxD3I5zwIMirc/q6Q/aevs7ad4Q82V0tTfte/wA33X6l6+TgfeIeZZPus89VXzPR6l69GU9UaCbFtQHNSpfYC8RV/Ul5s2LQvlWSEAQBAEAQBAEAQBAEAUA8wa1yy+vBt/Ka/lqOK9vgJf68PI+diKeaTN81H1fsa1jTr3DZc972Saj2iQ4ta0BpG4edfC2ptOrQruOfKtyX0OYYekoJ1DYrfUnR7594MQHBwrVS1wM7Di25GR1LDDauJk9036FsMLQei9SdmotjP/jDPI/lFY5dU5qztHFc79Dt4Ojw9TXtP6k2jL2yo06bmU67qoqAPcZ4tmMQXEkTsPQtdDaOI6Ko3K7VrfC7sVyox6SK8N5l26i2AOdP3uJBFeoXfOI2YZnfunnjN2piuf0RZ1Wne+X1ZGvwfWAP8jmIibmo3vCdp4rm9EWKhBaIjX4NdHlhIpva4tMFtZ5gxkQCYPaEW08TfveiOlTicTp1ZY3IbB5QvWKW4x5LSuUntQsRtup2v1exaKTmitQ3MLsL2TtwPg5beSR1EL5uM2dTxDzJ2l9/7xLIzsbfU4YLfDybW4LuZxptbPzg4mOxfPWxal98l6nfSo59rXrZcX7wasNpt8CkycDTsxEnNzoyk9gGa+thsHTw69nXiVyk2R1S1pq2DnupNpu4wNDhUDiOSSQRhcOcqMVhIYhJSbVuBMZNGU05wl3VxRqW7qVu1tQYXFramKDtiXkSs9HZlKnNTTe7yEqje40xzsnf/bl9JalZ6w0V/I0v1bPsheHqd9+ZsWhdLkkIAgCAIAgCAIAgCAIAgPMHCBlpK8H9c898H0r2Wzn/AK0PIw1u+zpfBY3Fotgwh2GrWIBiJD8QyPTC85tiCliZJrh9i6KThobpo+3FMEAR3RAJgADYM5/xHevm06agrI7pwyokZSBIIeJ3Q/t2RmrCwwetOV/ov9bXHfRctNB/46vkv/SKmv8AIvJl/Trg3YBpvDGtNJhiGA5l5O4sIawDM5zlnKz5fE6VX9lvmX9xTBeZIjKciTs6vSh0VaDIa6HSIIAgiMv+UB5koeA35o8y9wtDIzP169gZw0bhmTwOUH5lxLXZvb4LYGHfOZyk5VHEr9yZ17JbeyLWZ4hxAYRhD3NBfhpQ6S9xAxCsYz8JmRgrrLWt3lrw8N/8C6L7ibTDLbG8fJJYeWA5paQGy1x2OG0T4J6lTmr3s5xR1u4EaFGznOzvCG5mGvyBFSCffMhIZLthNN8BuwHKuv3x9BZcCjQtLYNZxtteBwbie5rThcOMaS7C45NwwyR8bzgTMqlW7cZRt/AsiS/bZ8W4ttrlryx8E4i1r+UWuJLowgYNxyJmcikHWzJOStch2NaOw9S2JnDPXGjx71T+Yz7IXiJ95mxaFwuSQgCAIAgCAIAgCAIAgCA8zcItu720u+S6DUmYMZtadq9hs1/60D59ecVNq6LXRest1aMNOhUqMaTiIjkycpAI6ArK+EoVpZpRu/MqhKXNYuPd9pPxt/0Kf4FlezMNy+rNPSPiXI170kR/5b/oUvwLnszDcr+rJ6T4ljf6y3lZ9OpUuKhfSM03clpYTvGEDNW08DQgmlHXXVkOe+9zIXGut6MhcVgeckDPqhR2dheT1f5M9OpVe9zVvkSN13voH5TWJ55A9Cns7C8nq/ydudTN393yKZ1zvy0tN1WMyPCjI9IEotn4bk9X+TvpJX7275GCAyiNi2jMuJAoMy4kpcoJzIu6WkqoaGirUDRBDQ9wAjZAnpPeq3Tg3dpE51xKh0pXxYuOq4oAnG6YBJAmdkud3lR0VO1rIZ/iQOk60h3HVJGw43TtDufna09gUdFC1rInOSXmmbhzCw1qhaZBBdMh0SCdpGWxQqFNO6QcjFTkepXXOLnruz8BnzW+YLxEtWbUVlBIQBAEAQBAEAQBAEAQBAYDSWiqD6jnPoUnOO1zqbSTlvJEq6GIqwVoyaXmUyw9KbvKKfyLM6v2h/o9L6IHmVvXcRzsr6nQ5EQ9zVp4vT8vrU9fxHOyOo4fkRMNW7T4hnl9adexHOyOoYfkQ9zdp8Qzy+tOvYjnY6hh+REfc3aeLs8vrTr2I52OoYfkQ9zdp4uzy+tOvYjnY6hh+RD3N2ni7PL6069iOdjqGH5EPc3afEM8vrTr2I52OoYfkQ9zdp8Qzy+tOvYjnY6hh+REDqzaeLs/a9adfxPOx1HD8iHuZtPF2eX1p1/Ec7HUcPyIe5u0+IZ5fWnXsRzsdQw/IiB1ZtPF2d7vWnX8RzsjqGG5ESHVWz+Ib9J/4lPaGJ5x2fh+X7gaqWY/mG/Sf+JO0MTzDqGH5TbGNgQFiNiViZCQgCAIAgCAIAgCAIAgCAxt2OWezzIQa9p3WOnaPa19Oq7EJDmNaW5kjDJcM8phbsNgpYiLcWt3gzJiMZGg0pJstTrzbBxDm1mwGlxNOQ3GARiwkxtAVE6EoycT7eG2bXxFGNaFrS0TdmZ9t6wgkGQIzG8HYQvkz2nQh0l7+xue7iZXQmmlxLCtrFTbWFA0q+JzXPBwDAWNLQ6piLvBGNsnpW2nNTipLR7ypqzsUqOtlB2B2Cu2jUc1rLh9ItoPLjDYccw1xgBzgGmRBzC7ILy309QeyvUY/ELZ1VtVoHLY6jixAt2/okjn3IClZ6wU6tQ06dOs7CWBzwz3tpqU21Wy6fgvadm9AZdAEBY31o57gWkDKDMHLOYBBAObYdug5K6nUjFWZRVpyk7opXlhUcKQY6nFMHE17ScZhojFtaDypME57Cq5O8my6McqSKNtoyqx7XY6REgu5HKmeVhIiMt5k7eeRySR4m8lp42jkWSCJxAYsYkNETLY5o37SBdaPZXE8c+k7JscW1zcwOUTJOROYG6Yk7UBehAZQKCSKAIAgCAIAgCAIAgCAIAgMdeeGezzIDXda9FvuWU2McwFtUO5ZIkBrshAOe/sK3YLERoyk5eKsYsZQlWjFR8Hc1zWLVOvWuLmsx7MDzTOA1CA8MDMTakbNmIZ8ypjVSSR67B7Uo0qNOnJb1ffbS/A2plq4CAGtDw3kz4OEThB3gLyeL2XiZVaqp2cajV29VY+W68L3bva/wAyz0voU16zZdFL2JdW1Qgw8GuaMEDqY89y9DRp9HTjDgkjE3d3LK6tLyvaixfSpNa5rKT7ltUFhptiX0qQGLGWtyBgNJmTGdhBSfqk91Kuab20rp1S8h4OJr6NxVqPbSrtG1pD5G9pzG8EBoTQdSlcuq1KGIPdbltVtyWhuC2pUnTSBh/KY7nkQgN0QEUBY31Co5wLDlEEQCM5kgEjleDG7bO5dKxopTgotSLe+ta+Gm2ngdhaQ41HvnFyIMtOYMPk7dnSoKZu8myk23ugQ4Chk4CC6pnTBfJmSMWEs3bcU7ghyXDjd4WGKGKAKgGOJnlOYSRlEZEIBY1bqRx1OlECTTcZBh0mHbpwbCd6gGSCAyoUEkUAQBAEAQBAEAQBAEAQBAY29PLPYpIKBKAkLBnkOVty25AZ8+QA7EALASCQJbMGMxIgwd2SACm3PkjleFkOVlGfPlkgIhgECBydnRkRl2EjtQAMEkwJdEmNsbJUgMptAAAEDYIyHUgJ8SAYkBK8ncqainf2TpWLHSjq0DimlxAd+mG8oAYQZIyOeeezZnItWhDKdOrctIbxTXtJ8I1ACBiI2ZycIB27TGW1SQVnXFwCRxLXD9Eh4E8uIIJ+BnPPlCAmsK1dxPHUmMENgtqYyTAxAiBAnFHOI2bEBfAIDLBckhAEAQBAEAQBAEAQBAEAQFvXtQ4zMFAUfa/5R7kBH2v+Ue5APa/5R7kA9r/lHuQEPa/5Xk/5QD2v+Ue5TcEfa/5R7kuB7Xj4R7kuCHtf8o9yXIsR9gfK8iXJHsD5XkS4I+wPleRLgj7C+V5EuB7C+V5EuCHsL5XkS4LsBQCKAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgP/2Q==" 
    },
    { 
        id: 21, 
        nama: "Folio Bergaris (4 Lembar)", 
        harga: 1000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWmlnEcKQXxh4zVPZpeAch7kwNzcJwZLck-S3xtEWLAQ&s=10" 
    },
    { 
        id: 22, 
        nama: "Kertas Manila", 
        harga: 5500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStkfxx2Rq1R0LlGctQgiFcONP3nqH66AdRDd75H_RS5w&s=10" 
    },
    { 
        id: 23, 
        nama: "Kertas Karton", 
        harga: 3000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgZuVj3XBJ9ZoQPJS-OTHEnvzDsstPsBN__eZGUREisQ&s=10" 
    },
    { 
        id: 24, 
        nama: "Kertas Asturo", 
        harga: 4500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT_qV7Ois2bkn6XxQqr1dpwQ4aQ7bV2Q4U-woB-q8Jrw&s=10" 
    },
    { 
        id: 25, 
        nama: "Snail Hecter", 
        harga: 3500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0ShGoPxe6avoeZH3_OClq_4clr0cXlo9XCDfc7lLCoA&s=10" 
    },
    { 
        id: 26, 
        nama: "Paperklip", 
        harga: 2000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_JkNCbSCAQo_1chuwjDZuCJzWzJFYYeUMxj9JpSbRTg&s=10" 
    },
    // --- KATEGORI: KOMPUTER & PERANGKAT ---
    { 
        id: 27, 
        nama: "Lem Kertas", 
        harga: 2000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxVmySIBaOw9VCs4GJGm8xnm3dHmFdeXNCA00UG8QqPA&s=10" 
    },
    { 
        id: 28, 
        nama: "Solasi Hitam", 
        harga: 2000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBlSRHVmCrVTeOh5YVH_4hd1SI7xneAfuzYAMakrwhw&s" 
    },
    { 
        id: 29, 
        nama: "Solasi Bening", 
        harga: 9000, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVYjLsasOVRsxzrKZWUhaQaQoSGmraLG9mLxwlcDsKpg&s=10" 
    },
    { 
        id: 30, 
        nama: "Gunting", 
        harga: 1500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "data:image/jpeg;base64,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" 
    },
    { 
        id: 31, 
        nama: "Cutter", 
        harga: 6500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxSwmno4J9xfYUQift9WeuMJqnz94uaOn4vJcWNQWI4w&s=10" 
    },
    { 
        id: 32, 
        nama: "Sticky Note (Kecil)", 
        harga: 4500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL40NtAK2tT2_CehAVZbrg3VnF-En3fbUhUQsW38LDFw&s=10" 
    },
    { 
        id: 33, 
        nama: "Sticky Note (Sedang)", 
        harga: 7500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "data:image/jpeg;base64,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" 
    },
    { 
        id: 34, 
        nama: "Correction Tape", 
        harga: 2500, 
        kategori: "Kertas & Perlengkapan",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6xEwmjMUm5Ir5BnQzQ_6D0530ZPSlbWDIOisGnkfuSw&s" 
    },
    { 
        id: 35, 
        nama: "Cetak Warna", 
        harga: 1500, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 36, 
        nama: "Cetak Hitam", 
        harga: 1500, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 37, 
        nama: "Cetak Warna (Bawa Kertas)", 
        harga: 1000, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 38, 
        nama: "Cetak Hitam (Bawa Kertas)", 
        harga: 500, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 39, 
        nama: "Fotocopy", 
        harga: 500, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 40, 
        nama: "Fotocopy Bolak-Balik", 
        harga: 1000, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 41, 
        nama: "Jasa Jilid", 
        harga: 2000, 
        kategori: "Jasa Cetak",
        gambar: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop" 
    },
    { 
        id: 42, 
        nama: "Mouse Wireless Logi", 
        harga: 95000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx6HXJezL9UrNNIoNnZXSd8-fwkIHIoYgfljCI0vOfuA&s=10" 
    },
    { 
        id: 43, 
        nama: "Keyboard Mechanical RGB", 
        harga: 250000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkuVpGY0C5CpvcilptN3JVCLC6Y87uJ7BrkjU3ru7xWA&s=10" 
    },
    { 
        id: 45, 
        nama: "Monitor LED 22 Inch", 
        harga: 1250000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzR_KoSdis4194hji10hIcTUl0bM80dFTXyJAIo5wDFw&s=10" 
    },
    { 
        id: 46, 
        nama: "Flashdisk SanDisk 32GB", 
        harga: 65000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTrxjSb6mYIbfBXuBLtHmseA9-y--8mVB4eh18bV2SzQ&s=10" 
    },
    { 
        id: 47, 
        nama: "SSD SATA 256GB", 
        harga: 320000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuDlnaIMHfHu8BsAbAvTxlgmzreTZVUqOwqKT-KMdYgA&s=10" 
    },
    { 
        id: 48, 
        nama: "Webcam Full HD 1080p", 
        harga: 185000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJQQ3a80KAqdlI6NYch4W8QUzw4_5LtTcqdTYTPVOzNg&s=10" 
    },
    { 
        id: 49, 
        nama: "Headset USB Gaming", 
        harga: 140000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3K6HzByPhQRkhinm4tcbXM0QFDx0PtlR1OM-PJfAu4w&s=10" 
    },
    { 
        id: 49, 
        nama: "Kabel HDMI 3 Meter", 
        harga: 35000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1ntXZbJ1w414lKh3TbipUhYHfoTjOMXf0mQQ4iDCfg&s=10" 
    },
    { 
        id: 50, 
        nama: "USB Hub 4 Port 3.0", 
        harga: 50000, 
        kategori: "Komputer",
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKL-9Q4IeJsv_ogH8450wtiytc9sd6Em3j4y_ML3sH1A&s=10" 
    },
];
// ==========================================
// FUNGSI UNTUK MENAMPILKAN PRODUK KE LAYAR KASIR
// ==========================================
function renderProduk(produkList = daftarProduk) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    grid.innerHTML = ""; // Bersihkan tampilan sebelumnya

    produkList.forEach(p => {
        grid.innerHTML += `
            <div class="product-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 12px; background: #fff; text-align: center;">
                <img src="${p.gambar}" alt="${p.nama}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;">
                <span class="badge" style="font-size: 11px; background: #eee; padding: 2px 6px; border-radius: 4px; color: #555;">${p.kategori}</span>
                <h3 style="font-size: 14px; margin: 8px 0 4px 0;">${p.nama}</h3>
                <p class="price" style="font-weight: bold; color: #007bff; margin-bottom: 8px;">Rp ${p.harga.toLocaleString('id-ID')}</p>
                <button onclick="tambahKeranjang(${p.id})" style="width: 100%; padding: 6px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    + Tambah
                </button>
            </div>
        `;
    });
}

// Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    renderProduk();
});
// --- LOGIN LOGIC ---
function prosesLogin(e) {
    e.preventDefault();
    const nama = document.getElementById("input-nama-petugas").value;
    const pass = document.getElementById("input-password").value;

    if (pass === PASSWORD_KASIR) {
        sessionStorage.setItem("kasir_login", "true");
        sessionStorage.setItem("petugas_aktif", nama);
        muatHalamanKasir();
    } else {
        alert("Password salah!");
    }
}

function muatHalamanKasir() {
    if (sessionStorage.getItem("kasir_login") === "true") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app-screen").style.display = "block";
        document.getElementById("label-petugas").innerText = "Petugas: " + sessionStorage.getItem("petugas_aktif");
        renderProduk(daftarProduk);
    }
}

function logout() {
    sessionStorage.clear();
    location.reload();
}

// --- RENDER PRODUK DENGAN GAMBAR ---
function renderProduk(listProduk) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (listProduk.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 20px;">Produk tidak ditemukan</p>';
        return;
    }

    listProduk.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="product-img-wrapper">
                    <img src="${p.gambar}" alt="${p.nama}" class="product-img">
                    <span class="badge-kategori">${p.kategori}</span>
                </div>
                <h3>${p.nama}</h3>
                <p class="price">Rp ${p.harga.toLocaleString('id-ID')}</p>
                <button onclick="tambahKeranjang(${p.id})">+ Tambah</button>
            </div>
        `;
    });
}

function filterProduk() {
    const keyword = document.getElementById("search-input").value.toLowerCase();
    const kategori = document.getElementById("category-select").value;

    const hasilFilter = daftarProduk.filter(p => {
        const cocokNama = p.nama.toLowerCase().includes(keyword);
        const cocokKategori = (kategori === "Semua") || (p.kategori === kategori);
        return cocokNama && cocokKategori;
    });

    renderProduk(hasilFilter);
}

// --- KERANJANG BELANJA ---
function tambahKeranjang(id) {
    const produk = daftarProduk.find(p => p.id === id);
    const ada = keranjang.find(item => item.id === id);
    if (ada) {
        ada.jumlah++;
    } else {
        keranjang.push({ ...produk, jumlah: 1 });
    }
    renderKeranjang();
}

function hapusKeranjang(id) {
    keranjang = keranjang.filter(item => item.id !== id);
    renderKeranjang();
}

function renderKeranjang() {
    const list = document.getElementById("cart-list");
    if (!list) return;
    list.innerHTML = "";
    let total = 0;

    if (keranjang.length === 0) {
        list.innerHTML = '<p class="empty-cart">Keranjang masih kosong</p>';
    } else {
        keranjang.forEach(item => {
            let subtotal = item.harga * item.jumlah;
            total += subtotal;
            list.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.nama}</strong><br>
                        <small>Rp ${item.harga.toLocaleString('id-ID')} x ${item.jumlah}</small>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <strong>Rp ${subtotal.toLocaleString('id-ID')}</strong>
                        <button onclick="hapusKeranjang(${item.id})" title="Batal Barang" style="background:#ef4444; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-weight:bold;">✕</button>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById("total-harga").innerText = `Rp ${total.toLocaleString('id-ID')}`;
    hitungKembalian();
}

function hitungKembalian() {
    const total = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    const inputUang = parseFloat(document.getElementById("input-uang-bayar")?.value) || 0;
    const kembalian = inputUang - total;

    const elKembalian = document.getElementById("label-kembalian");
    if (elKembalian) {
        if (kembalian >= 0) {
            elKembalian.innerText = `Rp ${kembalian.toLocaleString('id-ID')}`;
            elKembalian.style.color = "#4ade80";
        } else {
            elKembalian.innerText = `- Rp ${Math.abs(kembalian).toLocaleString('id-ID')} (Kurang)`;
            elKembalian.style.color = "#ef4444";
        }
    }
}

async function bayar() {
    if (keranjang.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
    }

    const total = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    const inputUang = parseFloat(document.getElementById("input-uang-bayar")?.value) || 0;

    if (inputUang < total) {
        alert("Uang pembayaran kurang!");
        return;
    }

    const orderId = "#TJKT-" + Math.floor(1000 + Math.random() * 9000);
    const waktu = new Date().toLocaleString('id-ID');
    const petugas = sessionStorage.getItem("petugas_aktif") || "Kasir";

    const { data, error } = await dbSupabase
        .from('transaksi')
        .insert([{ order_id: orderId, total: total, waktu: waktu, petugas: petugas }]);

    if (error) {
        alert("❌ Error Supabase: " + error.message);
        return;
    }

    document.getElementById("struk-id").innerText = orderId;
    document.getElementById("struk-tgl").innerText = waktu;
    document.getElementById("struk-petugas").innerText = petugas;
    document.getElementById("struk-total").innerText = `Rp ${total.toLocaleString('id-ID')}`;
    
    const itemsEl = document.getElementById("struk-items");
    itemsEl.innerHTML = "";
    keranjang.forEach(i => {
        itemsEl.innerHTML += `<li>${i.nama} x${i.jumlah} - Rp ${(i.harga * i.jumlah).toLocaleString('id-ID')}</li>`;
    });

    document.getElementById("modal-struk").style.display = "flex";
}

function tutupStruk() {
    document.getElementById("modal-struk").style.display = "none";
    keranjang = [];
    document.getElementById("input-uang-bayar").value = "";
    renderKeranjang();
}

document.addEventListener("DOMContentLoaded", muatHalamanKasir);