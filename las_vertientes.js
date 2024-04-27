async function modifyFile() {
    const originalFile = originalFileInput.files[0];
    const modifiedFilePath = modifiedFileInput.value.trim();
    const specialties = {
        "4468": "13.00",
        "8313": "18.00",
        "2114": "15.00",
        "1567": "16.00",
        "6533": "21.00",
        "4476": "14.08",
        "0583": "23.00",
        "0657": "16.00",
        "9444": "13.00",
        "0587": "13.00",
        "5146": "52.00",
        "9217": "14.14",
        "9445": "25.00",
        "0998": "18.00",
        "4675": "10.00",
        "0251": "18.00",
        "3097": "21.00",
        "1399": "15.00",
        "0326": "21.00",
        "1967": "16.00",
        "7725": "34.00",
        "8516": "13.00",
        "5785": "23.00",
        "3116": "23.00",
        "1130": "13.00",
        "7968": "23.00",
        "0606": "23.00",
        "7298": "14.14",
        "4501": "14.00",
        "0947": "40.00",
        "1199": "23.00",
        "6148": "14.00",
        "1557": "34.00",
        "6386": "16.00",
        "1952": "23.00",
        "5295": "40.00",
        "0452": "16.00",
        "1474": "21.00",
        "4210": "15.00",
        "0657": "16.00",
        "4468": "13.00",
        "9445": "25.00",
        "6662": "40.00",
        "7311": "23.00",
        "1567": "16.00",
        "0587": "13.00",
        "1967": "16.00",
        "8806": "13.00",
        "5567": "14.08",
        "9271": "14.14"
    };

    if (!originalFile || !modifiedFilePath) {
        alert('Please select the original file and provide the path of the modified file.');
        return;
    }

    try {
        const originalContent = await readFile(originalFile);
        const originalLines = originalContent.split('\r\n');
        const newLines = [];

        for (let i = 0; i < originalLines.length; i++) {
            let line = originalLines[i];
            line = line.replace(/(\*{5})(?=\d)/, '****').replace(/220102/g, '220101');
            const columns = line.split('*');

            if (columns.length >= 6) {
                const name = '';
                const memberNumber = columns[0].replace(/^.{13}/, '').substring(0, 10);
                const code = columns[8].substring(0, 6);
                const startDate = columns[4];
                const endDate = columns[4];
                let codeValue = parseFloat(columns[9].substring(3, 9) + '.' + columns[9].substring(9, 11)).toFixed(2);
                const codeDescription = '';
                const licenseNumber = columns[0].substring(columns[0].indexOf("MPS") - 4, columns[0].indexOf("MPS"));
                const providerNumber = 198785;
                const specialty = specialties[licenseNumber] ? specialties[licenseNumber] : "15.00";
                const providerName = "Las Vertientes";

                if (codeValue !== '0.00' && columns[8] !== '999997') {
                    const newLine = `CENT;AM;${name};${memberNumber};II;${providerNumber};${startDate};${endDate};${code};${codeDescription};;1;${codeValue};${specialty};;;;;;II;${providerNumber};${providerName};;;;;;;${licenseNumber};MN;C;;;;;0`;

                    newLines.push(newLine);
                }
            } else {
                console.warn(`Line ${i + 1} does not have enough columns.`);
            }
        }

        let modifiedContent = newLines.join('\n');
        const writable = await modifiedFileInput.handle.createWritable();

        let modifiedLines = modifiedContent.split('\n');
        modifiedContent = modifiedLines.join('\n');

        await writable.write(modifiedContent);
        await writable.close();

        alert('File modified successfully.');
        location.reload();
    } catch (error) {
        console.error(error);
        alert('An error occurred while modifying the file.');
    }
}

function readFile(file) {
    return file.text();
}