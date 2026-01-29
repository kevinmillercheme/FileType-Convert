// Grab DOM elements
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileName");
const dropDown = document.querySelector(".dropDown");
const convertButton = document.querySelector(".convertButton");
const downloadButton = document.querySelector(".downloadButton");
const previewDiv = document.querySelector(".preview");

let uploadedFile = null;   // store the uploaded file
let convertedBlob = null;   // store the converted file

// 1️⃣ Upload file
uploadButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
    uploadedFile = event.target.files[0];
    if (uploadedFile) {
        fileNameDisplay.textContent = uploadedFile.name;
    } else {
        fileNameDisplay.textContent = "No file selected";
    }
});

// 2️⃣ Convert button
convertButton.addEventListener("click", () => {
    if (!uploadedFile) {
        alert("Please upload a file first!");
        return;
    }

    const targetType = dropDown.value;
    if (targetType === "--select an option--") {
        alert("Please select a target file type!");
        return;
    }

    // 3️⃣ Read uploaded file as ArrayBuffer
    const reader = new FileReader();
    reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const view = new DataView(arrayBuffer);

        // Example: modify first byte to simulate "conversion"
        view.setUint8(0, 255);

        // 4️⃣ Store converted file as a Blob
        convertedBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });

        // 5️⃣ Display preview
        previewDiv.innerHTML = ""; // clear previous preview
        if (uploadedFile.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(convertedBlob);
            img.style.maxWidth = "300px";
            previewDiv.appendChild(img);
        } else {
            const p = document.createElement("p");
            p.textContent = `File converted to ${targetType}, preview not available.`;
            previewDiv.appendChild(p);
        }

        alert(`File converted to ${targetType}! You can now download it.`);
    };

    reader.readAsArrayBuffer(uploadedFile);
});

// 6️⃣ Download button
downloadButton.addEventListener("click", () => {
    if (!convertedBlob) {
        alert("No converted file available. Please upload and convert first.");
        return;
    }

    const targetType = dropDown.value.toLowerCase();
    const originalName = uploadedFile.name.split(".")[0];
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(convertedBlob);
    downloadLink.download = `${originalName}_converted.${targetType}`;
    downloadLink.click();
});
