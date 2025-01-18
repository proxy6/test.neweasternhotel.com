// Function to print the receipt
function printReceipt() {
    // Add CSS styles to match the receipt printer size
    const style = `
        <style>
            @page {
                size: 80mm 80mm; /* Set the receipt paper size */
                margin: 0; /* Remove default margins */
            }
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                width: 80mm; /* Ensure the content fits the paper width */
            }
            #receipt {
                width: 100%;
            }
        </style>
    `;

    // Get the receipt content
    const element = document.getElementById("receipt");

    // Temporarily add the style to the document
    const printStyles = document.createElement("style");
    printStyles.innerHTML = style;
    document.head.appendChild(printStyles);

    // Print the page
    window.print();

    // Remove the temporary styles after printing
    document.head.removeChild(printStyles);
}

// Event listener for the Print Receipt button
document.getElementById('printReceipt').addEventListener('click', function () {
    printReceipt();
});



// Function to generate PDF from HTML
function generatePDF() {
        // const doc = new jsPDF();
        // Hide the buttons temporarily
        const pdfContainer = document.getElementById('generatePDFButton');
        const printContainer = document.getElementById('printReceipt');
        pdfContainer.style.display = 'none';
        printContainer.style.display = 'none';
        // // Get HTML content of the specified section
        const element = document.getElementById("receipt");
        
         // Options for the PDF
         const options = {
            margin: 0.5,
            filename: 'receipt.pdf',
            image: { type: 'png', quality: 0.98 },
            html2canvas: { scale: 3 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            logging: true,
            letterRendering: 1,
            allowTaint: false,
            useCORS: true
        };

        // Generate PDF from HTML
        html2pdf()
            .from(element)
            .set(options)
            .save();
        // console.log(htmlContent)
        // // Add HTML content to PDF
        // doc.fromHTML(htmlContent, {
        //     callback: function (doc) {
        //         // Save the PDF
        //         doc.save('invoice.pdf');
        //     }
        // });
        // var doc = new jsPDF('l', 'mm', [62, 32])
//   const margins = {
//     top: 10,
//     bottom: 10,
//     left: 20,
//     width: 600
//   }
// doc.fromHTML(document.body)
//   doc.fromHTML(htmlContent, margins.left, margins.top, {
//     width: margins.width
//   })

//   doc.save('test.pdf')
 }

    // Event listener for the generate PDF button
document.getElementById('generatePDFButton').addEventListener('click', function() {
    generatePDF();
    setTimeout(() => {
        location.reload(); // Reloads the current page
    }, 3000); // 
});