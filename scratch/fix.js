const fs = require('fs');
const path = require('path');

const root = 'C:/Users/amyog/Desktop/Wizkoo';

const allowlistText = fs.readFileSync(path.join(root, 'publish-allowlist.txt'), 'utf8');
const shippedFiles = new Set();
const cssFiles = [];
const jsFiles = [];

// Parse allowlist
allowlistText.split('\n').forEach(line => {
    line = line.split('#')[0].trim();
    if (!line || line === 'publish:' || line === 'declined:') return;
    if (line.includes('*')) {
        // Simple glob parsing for known patterns
        if (line === 'esa/*/index.html') {
            const esaDir = path.join(root, 'esa');
            if (fs.existsSync(esaDir)) {
                fs.readdirSync(esaDir).forEach(d => {
                    const fp = path.join(esaDir, d, 'index.html');
                    if (fs.existsSync(fp)) shippedFiles.add(fp);
                });
            }
        } else if (line === 'games/*.html') {
            const gamesDir = path.join(root, 'games');
            if (fs.existsSync(gamesDir)) {
                fs.readdirSync(gamesDir).forEach(f => {
                    if (f.endsWith('.html')) shippedFiles.add(path.join(gamesDir, f));
                });
            }
        } else if (line === 'css/*.css') {
            const cssDir = path.join(root, 'css');
            if (fs.existsSync(cssDir)) {
                fs.readdirSync(cssDir).forEach(f => {
                    if (f.endsWith('.css')) cssFiles.push(path.join(cssDir, f));
                });
            }
        }
    } else {
        const fp = path.join(root, line);
        if (fs.existsSync(fp) && line.endsWith('.html')) shippedFiles.add(fp);
    }
});

const tokens = [
    { hex: '#E8AF38', token: 'var(--saffron)' },
    { hex: '#B88414', token: 'var(--saffron-deep)' },
    { hex: '#FFF9EE', token: 'var(--saffron-pale)' },
    { hex: '#0C1020', token: 'var(--ink)' },
    { hex: '#F8F4E9', token: 'var(--linen)' },
    { hex: '#FAFAFA', token: 'var(--paper)' },
    { hex: '#2868CC', token: 'var(--day-sky)' },
    { hex: '#4A4850', token: 'var(--mid)' },
    { hex: '#A8A6B0', token: 'var(--faint)' },
    { hex: '#E0DED6', token: 'var(--rule)' },
    { hex: '#0C1430', token: 'var(--lib-bg)' },
    { hex: '#ECE5D3', token: 'var(--lib-fg)' },
    { hex: '#E6A82E', token: 'var(--lib-saffron)' },
    { hex: '#F3E9D2', token: 'var(--lib-cream)' },
    { hex: '#231A14', token: 'var(--lib-ink)' },
    // rgba tokens
    { hex: 'rgba(12, 16, 32, 0.60)', token: 'var(--ink-60)' },
    { hex: 'rgba(12, 16, 32, 0.6)', token: 'var(--ink-60)' },
    { hex: 'rgba(12, 16, 32, 0.45)', token: 'var(--ink-45)' },
    { hex: 'rgba(12, 16, 32, 0.28)', token: 'var(--ink-28)' },
    { hex: 'rgba(12, 16, 32, 0.12)', token: 'var(--ink-12)' },
    { hex: 'rgba(236,229,211,0.6)', token: 'var(--lib-dim)' },
    { hex: 'rgba(236,229,211,0.16)', token: 'var(--lib-rule)' },
    { hex: 'rgba(35,26,20,0.6)', token: 'var(--lib-ink-dim)' },
    { hex: 'rgba(35,26,20,0.16)', token: 'var(--lib-ink-rule)' },
    { hex: 'rgba(230,168,46,0.4)', token: 'var(--lib-saffron-dim)' },
    // near misses
    { hex: '#E8AF37', token: 'var(--saffron)' },
    { hex: '#f2f0ea', token: 'var(--linen)' },
    { hex: '#f0f2f8', token: 'FINDING: Off-white not in tokens' },
    { hex: '#c8c5bc', token: 'FINDING: Gray #C8C5BC not in tokens' },
    { hex: '#5f5e5a', token: 'FINDING: Gray #5F5E5A not in tokens' },
    { hex: '#8c8a84', token: 'FINDING: Gray #8C8A84 not in tokens' },
    { hex: '#c8852a', token: 'FINDING: Orange #C8852A not in tokens' },
    { hex: '#a86a1a', token: 'FINDING: Orange #A86A1A not in tokens' },
    { hex: '#d49e2a', token: 'FINDING: Saffron hover #D49E2A not in tokens' },
    { hex: '#182848', token: 'FINDING: Dark blue #182848 not in tokens' },
    { hex: '#101830', token: 'FINDING: Dark blue #101830 not in tokens' }
];

const allFiles = [...shippedFiles, ...cssFiles];

let inventory = "file:line | hard-coded value | token adopted | FINDING\n";
inventory += "--------------------------------------------------------\n";

for (const fp of allFiles) {
    if (!fs.existsSync(fp)) continue;
    if (fp.endsWith('tokens.css')) continue; // skip the token definition file
    let content = fs.readFileSync(fp, 'utf8');
    const lines = content.split('\n');
    let changed = false;

    // Check Hex values
    const regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
    
    for (let i=0; i<lines.length; i++) {
        let line = lines[i];
        
        let match;
        // Collect matches first to prevent infinite loops if replacing with something that matches again (though we replace with var())
        const hexMatches = [...line.matchAll(regex)];
        for (const m of hexMatches) {
            const hex = m[0].toUpperCase();
            let adopted = null;
            let finding = null;
            let targetToken = tokens.find(t => t.hex.toUpperCase() === hex);
            
            if (targetToken) {
                if (targetToken.token.startsWith('FINDING')) {
                    finding = targetToken.token;
                    adopted = 'N/A';
                } else {
                    adopted = targetToken.token;
                    line = line.replace(m[0], adopted);
                    changed = true;
                }
            } else {
                finding = `FINDING: ${hex} has no token`;
                adopted = 'N/A';
            }
            inventory += `${path.basename(fp)}:${i+1} | ${m[0]} | ${adopted} | ${finding ? finding : ''}\n`;
        }
        
        // Also check RGBA matches for our known tokens
        for (const t of tokens) {
            if (t.hex.startsWith('rgba')) {
                // simple replace for exact rgba strings
                if (line.includes(t.hex)) {
                    if (t.token.startsWith('FINDING')) {
                        inventory += `${path.basename(fp)}:${i+1} | ${t.hex} | N/A | ${t.token}\n`;
                    } else {
                        inventory += `${path.basename(fp)}:${i+1} | ${t.hex} | ${t.token} | \n`;
                        line = line.split(t.hex).join(t.token);
                        changed = true;
                    }
                }
            }
        }
        
        lines[i] = line;
    }
    
    if (changed) {
        fs.writeFileSync(fp, lines.join('\n'));
    }
}

fs.writeFileSync(path.join(root, 'scratch', 'inventory.txt'), inventory);
console.log("Done generating inventory and rewriting CSS/HTML.");
