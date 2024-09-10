const cpuCtx = document.getElementById('cpu-chart').getContext('2d');
const memoryCtx = document.getElementById('memory-chart').getContext('2d');
const diskCtx = document.getElementById('disk-chart').getContext('2d');
const networkCtx = document.getElementById('network-chart').getContext('2d');

const cpuChart = new Chart(cpuCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'CPU Usage (%)',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

const memoryChart = new Chart(memoryCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Memory Usage (%)',
      data: [],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

const diskChart = new Chart(diskCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Disk Usage (%)',
      data: [],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

const networkChart = new Chart(networkCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Network Sent Speed (MB/s)',
        data: [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 1
      },
      {
        label: 'Network Received Speed (MB/s)',
        data: [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

// Function to fetch data from the server
async function fetchData() {
  try {
    const response = await fetch('http://localhost:5000/api/resource-stats');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data); // Debugging line

    // Update charts with new data
    updateChart(cpuChart, data.cpu);
    updateChart(memoryChart, data.memory.usage);
    updateChart(diskChart, data.disk.usage);
    updateNetworkChart(networkChart, data.network_io);

    // Convert disk read/write speeds to appropriate units
    const readSpeed = data.disk_io.read_speed > 1 ? (data.disk_io.read_speed).toFixed(2) + ' MB/s' : (data.disk_io.read_speed * 1024).toFixed(2) + ' KB/s';
    const writeSpeed = data.disk_io.write_speed > 1 ? (data.disk_io.write_speed).toFixed(2) + ' MB/s' : (data.disk_io.write_speed * 1024).toFixed(2) + ' KB/s';

    // Display additional information
    document.getElementById('cpu-info').innerText = `CPU Usage: ${data.cpu.toFixed(2)}%`;
    document.getElementById('memory-info').innerText = 
      `Memory: ${data.memory.usage.toFixed(2)}% (${data.memory.total.toFixed(2)} GB total, ${data.memory.available.toFixed(2)} GB available)`;
    document.getElementById('disk-info').innerText = 
      `Disk: ${data.disk.usage.toFixed(2)}% (${data.disk.total.toFixed(2)} GB total, ${data.disk.free.toFixed(2)} GB free)`;
    document.getElementById('disk-io-info').innerText = 
      `Disk Read Speed: ${readSpeed}\nDisk Write Speed: ${writeSpeed}`;
    document.getElementById('network-info').innerText = 
      `Network Sent Speed: ${data.network_io.sent_speed.toFixed(2)} MB/s\nNetwork Received Speed: ${data.network_io.recv_speed.toFixed(2)} MB/s`;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to update a chart with new data
function updateChart(chart, newData) {
  chart.data.labels.push(new Date().toLocaleTimeString()); // Add current time as label
  chart.data.datasets[0].data.push(newData);

  // Limit the number of data points to 50
  if (chart.data.labels.length > 50) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }

  chart.update();
}

function updateNetworkChart(chart, networkData) {
  const currentTime = new Date().toLocaleTimeString();
  chart.data.labels.push(currentTime); // Add current time as label

  chart.data.datasets[0].data.push(networkData.sent_speed);
  chart.data.datasets[1].data.push(networkData.recv_speed);

  // Limit the number of data points to 50
  if (chart.data.labels.length > 50) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
  }

  chart.update();
}

// Fetch data every 5 seconds
setInterval(fetchData, 5000);
