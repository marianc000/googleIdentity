function td(val) {
    return `<td>${val ?? ''}</td>`;
}
 
 
export function table(ar, caption) {
    if (!ar.length) return '';

    const cols = Object.keys(ar[0]).filter(k => k !== 'private').sort();
    return `<table><caption>${caption}</caption>` + cols.reduce((t, col) => t + `<th>${col}</th>`, '<tr>') + '</tr>'
        + ar.reduce((t, o) => t
            + cols.reduce((row, col) => row + td(o[col]), '<tr>') + '</tr>', '')
        + '</table>';
}
