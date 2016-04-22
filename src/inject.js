chrome.extension.sendMessage({}, function (response) {

    /** Shoutout to Jeff Gran and joelpt **/
    const copyTextToClipboard = function (text) {
        let copyFrom = document.createElement('textarea');
        copyFrom.textContent = text;
        document.body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        document.body.removeChild(copyFrom);
    };

    let readyStateCheckInterval = setInterval(function () {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);

            let tables = document.getElementsByClassName('wikitable');

            for (let i = 0; i < tables.length; i++) {
                const exportButton = document.createElement('button');
                exportButton.innerHTML = 'Export table to CSV';

                const table = tables[i];

                exportButton.onclick = () => {
                    let csv = [];
                    let rows = table.rows;

                    for (i = 0; i < rows.length; i++) {
                        let cells = rows[i].cells;
                        let csv_row = [];
                        for (j = 0; j < cells.length; j++) {
                            let clone = document.createElement('div');
                            clone.innerHTML = cells[j].innerHTML;

                            for (c = 0; c < clone.childNodes.length; c++) {
                                let node = clone.childNodes[c];
                                if ('reference' === node.className) {
                                    clone.removeChild(node);
                                }
                            }

                            csv_row.push('"' + clone.innerText.trim() + '"');
                        }
                        csv.push(csv_row.join(','));
                    }
                    copyTextToClipboard(csv.join("\n"));
                    exportButton.innerText = 'Copied!';
                    setTimeout(() => {
                        exportButton.innerText = 'Export table to CSV';
                    }, 500);
                };

                table.parentNode.insertBefore(exportButton, table);
            }

        }
    }, 10);
});