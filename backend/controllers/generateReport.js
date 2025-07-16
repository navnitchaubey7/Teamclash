// backend/controllers/generateReport.js

const ExcelJS = require('exceljs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const Users = require("../models/User")

exports.generateDownloadReport = async (req, res) => {
  try {
    // 1️⃣ Generate Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Team Report');
     const users = await Users.find();
    worksheet.columns = [
      { header: "User", key: 'user' },
      { header: "User ID", key: 'id' },
      { header: "Password", key: 'password' },
    ];
    users.forEach(user => {
      worksheet.addRow({
        user: user.username || user.name || 'N/A',
        id: user._id,
        password: user.password, 
      });
    });

    const excelPath = path.join(__dirname, '../../backend/tmp/report.xlsx');
    await workbook.xlsx.writeFile(excelPath);

    const chartCanvas = new ChartJSNodeCanvas({ width: 600, height: 400 });

    const chartConfig = {
      type: 'pie',
      data: {
        labels: ['Done', 'In Progress', 'Pending'],
        datasets: [{
          data: [1, 1, 1],
          backgroundColor: ['green', 'orange', 'red'],
        }],
      },
    };

    const imageBuffer = await chartCanvas.renderToBuffer(chartConfig);
    const chartPath = path.join(__dirname, '../../backend/tmp/chart.png');
    fs.writeFileSync(chartPath, imageBuffer);

    // 3️⃣ Create Zip
    const zipPath = path.join(__dirname, '../../backend/tmp/download.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=report.zip');
      fs.createReadStream(zipPath).pipe(res);
    });

    archive.pipe(output);
    archive.file(excelPath, { name: 'report.xlsx' });
    archive.file(chartPath, { name: 'chart.png' });
    archive.finalize();

  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
};
