export default function combinePaths(...paths: string[]): string {
    return paths
        .filter(path => path)
        .map(path => path.replace(/^[\\|\/]/, '').replace(/[\\|\/]$/, ''))
        .filter(path => path)
        .join('/')
        .replace(/\\/g, '/');
}