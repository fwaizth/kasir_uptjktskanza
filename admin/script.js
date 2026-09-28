const SUPABASE_URL = "https://iojbgkyvjxxtvciqpmst.supabase.co"; // Ganti dengan URL Supabase kamu
const SUPABASE_KEY = "sb_publishable_a4ScDCfEIbYfqabbYWVWvQ_hlfOO2_i";   // Ganti dengan anon public key kamu

var dbSupabase;
try {
    dbSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (err) {
    console.error("Gagal koneksi Admin Supabase:", err);
}

let dataTransaksiGlobal = [];

async function muatDataAdmin() {
    const tabel = document.getElementById("tabel-transaksi");
    if (!tabel) return;

    const { data: riwayat, error } = await dbSupabase.from('transaksi').select('*');

    if (error) {
        alert("❌ Admin Supabase Error: " + error.message);
        tabel.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#ef4444; padding:20px;">Error: ${error.message}</td></tr>`;
        return;
    }

    dataTransaksiGlobal = riwayat || [];
    renderTabelAdmin(dataTransaksiGlobal);
}

// FUNGSI UNTUK MERENDER TABEL & STATISTIK
function renderTabelAdmin(dataList) {
    const tabel = document.getElementById("tabel-transaksi");
    if (!tabel) return;

    let totalRp = 0;
    tabel.innerHTML = "";

    if (dataList && dataList.length > 0) {
        [...dataList].reverse().forEach(item => {
            const totalItem = item.total || 0;
            totalRp += totalItem;
            tabel.innerHTML += `
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 12px;">${item.order_id || item.id || '-'} <br><small style="color:#94a3b8;">(${item.waktu || '-'})</small></td>
                    <td style="padding: 12px;"><strong style="color:#38bdf8;">👤 ${item.petugas || 'Kasir'}</strong></td>
                    <td style="padding: 12px;">Rp ${totalItem.toLocaleString('id-ID')}</td>
                    <td style="padding: 12px;"><span style="background: #166534; color: #4ade80; padding: 4px 8px; border-radius: 4px; font-size: 12px;">SUKSES</span></td>
                </tr>
            `;
        });
    } else {
        tabel.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color:#94a3b8;">Belum ada data transaksi di Cloud</td></tr>`;
    }

    const elemTotal = document.getElementById("rekap-total");
    const elemJumlah = document.getElementById("rekap-jumlah");

    if (elemTotal) elemTotal.innerText = `Rp ${totalRp.toLocaleString('id-ID')}`;
    if (elemJumlah) elemJumlah.innerText = `${dataList.length} Transaksi`;

    renderGrafik(totalRp, dataList.length);
}

// EKSPOR KE EXCEL (DIPERBARUI: MENGGUNAKAN EXCEL XML FORMATTING)
function eksporExcel() {
    if (dataTransaksiGlobal.length === 0) {
        alert("Tidak ada data transaksi untuk diekspor!");
        return;
    }

    // Header Laporan
    let excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]>
        <xml>
            <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                        <x:Name>Laporan Penjualan</x:Name>
                        <x:WorksheetOptions>
                            <x:DisplayGridlines/>
                        </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                </x:ExcelWorksheets>
            </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
            th { background-color: #0284c7; color: #ffffff; font-weight: bold; height: 35px; text-align: center; }
            td { text-align: left; vertical-align: middle; height: 28px; }
            .number { text-align: right; mso-number-format:"\\#\\,\\#\\#0"; }
            .center { text-align: center; }
        </style>
    </head>
    <body>
        <h2>LAPORAN TRANSAKSI KASIR UP-TJKT</h2>
        <table border="1">
            <thead>
                <tr>
                    <th style="width:150px;">Order ID</th>
                    <th style="width:180px;">Waktu Transaksi</th>
                    <th style="width:150px;">Nama Petugas</th>
                    <th style="width:150px;">Total (Rp)</th>
                </tr>
            </thead>
            <tbody>`;

    // Isi Baris Data
    dataTransaksiGlobal.forEach(row => {
        const orderId = row.order_id || row.id || '-';
        const waktu = row.waktu || '-';
        const petugas = row.petugas || 'Kasir';
        const total = row.total || 0;

        excelContent += `
            <tr>
                <td class="center">'${orderId}</td>
                <td class="center">${waktu}</td>
                <td>${petugas}</td>
                <td class="number">${total}</td>
            </tr>`;
    });

    excelContent += `
            </tbody>
        </table>
    </body>
    </html>`;

    // Buat Blob dan Link Unduhan
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const tanggalHariIni = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `Laporan_Kasir_TJKT_${tanggalHariIni}.xls`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function renderGrafik(total, jumlah) {
    const ctx = document.getElementById('grafikPenjualan');
    if (!ctx) return;
    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Penjualan (Rp)', 'Jumlah Transaksi'],
            datasets: [{ label: 'Statistik Cloud', data: [total, jumlah], backgroundColor: ['#38bdf8', '#4ade80'] }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

async function hapusSemua() {
    if (confirm("Hapus seluruh transaksi dari cloud?")) {
        await dbSupabase.from('transaksi').delete().neq('id', 0);
        muatDataAdmin();
    }
}

// ==========================================
// FITUR REALTIME SUPABASE (AUTO UPDATE TANPA REFRESH)
// ==========================================
function aktifkanRealtimeAdmin() {
    dbSupabase
        .channel('skema-transaksi-realtime')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'transaksi' },
            (payload) => {
                console.log("Ada transaksi baru masuk:", payload.new);
                dataTransaksiGlobal.push(payload.new);
                renderTabelAdmin(dataTransaksiGlobal);
            }
        )
        .subscribe();
}

// Panggil fungsi realtime saat halaman Admin selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    muatDataAdmin();
    aktifkanRealtimeAdmin();
});

// ==========================================
// LOGIKA FILTER KALENDER / TANGGAL
// ==========================================
function filterBerdasarkanTanggal() {
    const inputElem = document.getElementById("input-kalender");
    if (!inputElem) return;

    const nilaiKalender = inputElem.value; // Format: YYYY-MM-DD
    if (!nilaiKalender) return;

    const [tahun, bulan, hari] = nilaiKalender.split("-");
    const tanggalCari = `${parseInt(hari)}/${parseInt(bulan)}/${tahun}`;

    const hasilFilter = dataTransaksiGlobal.filter(item => {
        return item.waktu && item.waktu.includes(tanggalCari);
    });

    renderTabelAdmin(hasilFilter);
}

function resetFilterTanggal() {
    const inputElem = document.getElementById("input-kalender");
    if (inputElem) inputElem.value = "";
    
    renderTabelAdmin(dataTransaksiGlobal);
}