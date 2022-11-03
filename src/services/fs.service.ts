export async function writeFile(content: Object) {
    const fileHandle = await getNewFileHandle();
    const writable = await (fileHandle as any).createWritable();
    await writable.write(content);
    await writable.close();
}

export async function readFile(): Promise<string> {
    const [fileHandle] = await (window as any).showOpenFilePicker();
    const file = await (fileHandle as any).getFile();
    const contents = await file.text();
    return contents;
}

export async function getNewFileHandle() {
    const options = {
        types: [
            {
                description: 'JSON Files',
                accept: {
                    'application/json': ['.json'],
                },
            },
        ],
    };
    const handle = await (window as any).showSaveFilePicker(options);
    return handle;
}
