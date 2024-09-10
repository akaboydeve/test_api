from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the previous values to calculate delta
prev_disk_io = psutil.disk_io_counters()
prev_net_io = psutil.net_io_counters()

def get_disk_io_stats():
    global prev_disk_io
    current_disk_io = psutil.disk_io_counters()
    read_speed = (current_disk_io.read_bytes - prev_disk_io.read_bytes) / (1024 ** 2)  # MB/s
    write_speed = (current_disk_io.write_bytes - prev_disk_io.write_bytes) / (1024 ** 2)  # MB/s

    # Update previous values
    prev_disk_io = current_disk_io

    return {
        'read_speed': read_speed,
        'write_speed': write_speed
    }

def get_network_io_stats():
    global prev_net_io
    current_net_io = psutil.net_io_counters()
    bytes_sent = current_net_io.bytes_sent - prev_net_io.bytes_sent
    bytes_received = current_net_io.bytes_recv - prev_net_io.bytes_recv
    sent_speed = bytes_sent / (1024 ** 2)  # MB/s
    recv_speed = bytes_received / (1024 ** 2)  # MB/s

    # Update previous values
    prev_net_io = current_net_io

    return {
        'sent_speed': sent_speed,
        'recv_speed': recv_speed
    }

@app.route('/api/resource-stats', methods=['GET'])
def get_resource_stats():
    # Get CPU usage percentage
    cpu_usage = psutil.cpu_percent(interval=1)

    # Get memory usage information
    memory_info = psutil.virtual_memory()
    memory_usage = memory_info.percent
    memory_total = memory_info.total / (1024 ** 3)  # Convert bytes to GB
    memory_available = memory_info.available / (1024 ** 3)  # Convert bytes to GB

    # Get disk usage information
    disk_info = psutil.disk_usage('/')
    disk_usage = disk_info.percent
    disk_total = disk_info.total / (1024 ** 3)  # Convert bytes to GB
    disk_free = disk_info.free / (1024 ** 3)  # Convert bytes to GB

    # Get disk read and write speeds
    disk_io = get_disk_io_stats()

    # Get network sent and received speeds
    network_io = get_network_io_stats()

    return jsonify({
        'cpu': cpu_usage,
        'memory': {
            'usage': memory_usage,
            'total': memory_total,
            'available': memory_available
        },
        'disk': {
            'usage': disk_usage,
            'total': disk_total,
            'free': disk_free
        },
        'disk_io': disk_io,
        'network_io': network_io
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
