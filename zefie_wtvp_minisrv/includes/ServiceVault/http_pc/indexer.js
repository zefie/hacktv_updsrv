var minisrv_service_file = true;
try {
    var relativePath = request_headers.request_url;
    if (relativePath.indexOf('?') > -1) relativePath = relativePath.split('?')[0];
    while (relativePath.endsWith('/')) relativePath = relativePath.substring(0, relativePath.length - 1);

    var dir = service_name + relativePath;
    var num_per_page = 25;
    var files = ['<tr><td>DIR</td><td><a href="'+relativePath+'/..">Parent Directory</a></td><td>-</td><td>-</td></tr > '];

    

    // Iterate through each service vault to find the first occurrence
    for (let i = 0; i < service_vaults.length; i++) {
        const vaultPath = path.join(service_vaults[i], dir || '');
        console.log(vaultPath)
        if (!fs.existsSync(vaultPath)) continue;

        try {
            const entries = fs.readdirSync(vaultPath);

            entries.forEach(entry => {
                if (entry === path.basename(__filename)) return;

                // Check if entry exists in all service vaults
                let found = false;
                var checkPath = "";
                for (let j = 0; j < service_vaults.length; j++) {
                    checkPath = path.join(service_vaults[j], dir || '', entry);
                    if (fs.existsSync(checkPath)) {
                        found = true;
                        break;
                    }
                }

                // Skip if not found in all
                if (!found) return;

                const fullPath = checkPath;
                const stats = fs.statSync(fullPath);
                const isDir = stats.isDirectory();
                const mimeType = (isDir) ? "DIR" : wtvmime.getContentType(fullPath)[1];
                var readableSize = '-';
                // Get file size with unit
                if (!isDir) {
                    const fileSize = stats.size;
                    const units = ['Bytes', 'KB', 'MB', 'GB'];
                    const unitSize = Math.floor(Math.log(fileSize) / Math.log(1024));
                    readableSize = (fileSize / Math.pow(1024, unitSize)).toFixed(2) + units[unitSize];
                }
                // Get last modified time
                const mtime = stats.mtime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                // Check if modified recently
                const currentTime = Date.now();
                const tenSecondsAgo = currentTime - 10000;
                const isModifiedRecently = stats.mtime.getTime() > tenSecondsAgo;

                // Create clickable link
                const link = isDir ?
                    `<a href="${relativePath}/${entry}" target="_blank">${entry}</a>` :
                    `<a href="${relativePath}/${path.basename(fullPath)}" target="_blank">${entry}</a>`;

                // Generate icon and timestamp display
                const icon = mimeType;
                const timestampDisplay = isModifiedRecently ?
                    `<span style="color: #666;">(Updated: ${mtime})</span>` :
                    `(Updated: ${mtime})`;

                files.push(
                    `<tr><td>${icon}</td><td>${link}</td><td>${readableSize}</td><td>${timestampDisplay}</td></tr>`
                );
            });
        } catch (err) {
            console.error('Error:', err);
            continue;
        }
    }

    // Pagination logic
    const totalFiles = files.length;
    const max_pages = Math.ceil(totalFiles / num_per_page);
    let current_page = 1; // Default to first page
    if (totalFiles > 0) {
        current_page = parseInt(request_headers.query.page || 1);
        if (current_page < 1) current_page = 1;
        if (current_page > max_pages) current_page = max_pages;
    }

    const start_index = (current_page - 1) * num_per_page;
    const end_index = current_page * num_per_page;
    const paginatedFiles = files.slice(start_index, end_index);

    let paginationHtml = `
    <div style="text-align: center; margin-top: 20px;">
        <form action="" method="get" style="display: inline;">
        <input type=button onclick="window.location.href='?page=1'" ${(current_page === 1) ? 'disabled' : ''} value="First"></input>
        <input type=button onclick="window.location.href='?page=${Math.max(current_page - 1, 1)}'" ${(current_page === 1) ? 'disabled' : ''} value="Previous"></input>
        <span style="margin: 0 10px;">Page ${current_page} of ${max_pages}</span>
        <input type=button onclick="window.location.href='?page=${Math.min(current_page + 1, max_pages)}'" ${(current_page === max_pages) ? 'disabled' : ''} value="Next"></input>
        <input type=button onclick="window.location.href='?page=${max_pages}'" ${(current_page === max_pages) ? 'disabled' : ''} value="Last"></input>
        </form>
    </div>`;

    data = `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <title>Directory Index</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #1e1e1e;
            color: #ffffff;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #333; }
        tr:hover { background-color: #2a2a2a; }
    </style>
</head>
<body>
    <h2>Directory Index of ${relativePath}</h2>
    <table>
        <tr><th>Type/Icon</th><th>Name</th><th>Size</th><th>Last Modified</th></tr>
        ${paginatedFiles.join('')}
    </table>
    ${paginationHtml}
    <script>
        function toggleTheme() { ... }
    </script>
</body>
</html>`;

    headers = `200 OK\nContent-Type: text/html`;

} catch (err) {
    console.error('Error:', err);
    var err = wtvshared.doErrorPage(404);
    headers = err[0];
    data = err[1];
}