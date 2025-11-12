#!/bin/bash

# Install nginx-module-brotli for Brotli compression
sudo apt update
sudo apt install nginx-module-brotli -y

# Add Brotli module to nginx.conf (add this line at the top of /etc/nginx/nginx.conf)
echo "load_module modules/ngx_http_brotli_filter_module.so;" | sudo tee -a /etc/nginx/nginx.conf
echo "load_module modules/ngx_http_brotli_static_module.so;" | sudo tee -a /etc/nginx/nginx.conf

# Optimize system for better performance
# Increase file descriptor limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize kernel parameters for network performance
sudo tee -a /etc/sysctl.conf << EOF
# Network optimizations
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_congestion_control = bbr

# File system optimizations
fs.file-max = 2097152
vm.swappiness = 10
EOF

# Apply kernel parameters
sudo sysctl -p

# Optimize nginx worker processes
CPU_CORES=$(nproc)
sudo sed -i "s/worker_processes auto;/worker_processes $CPU_CORES;/" /etc/nginx/nginx.conf

# Add nginx optimizations to main config
sudo tee -a /etc/nginx/nginx.conf << EOF

# Performance optimizations
worker_rlimit_nofile 65536;
events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Enable sendfile for better file serving
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # Optimize keepalive
    keepalive_timeout 30;
    keepalive_requests 100;
    
    # Enable open file cache
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
EOF

# Restart services
sudo systemctl restart nginx
sudo systemctl restart your-node-app

echo "Server optimization completed!"
echo "Make sure to:"
echo "1. Upload your Brotli-compressed Unity builds (.br files)"
echo "2. Update your nginx site config with the new configuration"
echo "3. Test nginx config: sudo nginx -t"
echo "4. Reload nginx: sudo systemctl reload nginx"