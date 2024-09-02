// script.js
function convertData() {
    const fileInput = document.getElementById('fileInput');
    const graphType = document.querySelector('input[name="graphType"]:checked').value;

    if (fileInput.files.length === 0) {
        alert("Please upload a data sheet.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        drawChart(jsonData, graphType);
    };

    reader.readAsArrayBuffer(file);
}

function drawChart(data, type) {
    const labels = data[0].slice(1); // Assuming the first row contains labels
    const datasets = data.slice(1).map(row => ({
        label: row[0], // First cell of each row is the label
        data: row.slice(1),
        backgroundColor: type === 'pie' ? getRandomColors(row.length) : 'rgba(255, 99, 132, 0.2)',
        borderColor: type === 'pie' ? getRandomColors(row.length) : 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }));

    const ctx = document.getElementById('chartCanvas').getContext('2d');

    // Destroy any existing chart
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`);
    }
    return colors;
}
