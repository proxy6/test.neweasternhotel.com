

  const  addCustBtn =  document.getElementById("addCustomerForm")
  //submit add customer form
  addCustBtn.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    
    let formData = Object.fromEntries(new FormData(this));
    console.log("got here")
    console.log(formData)
    // addCustBtn.disabled = true
    // fetch("/customers", {
    //     method: "POST",
    //     body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
        
    //     toastr.options = {
    //       closeButton: false,
    //       progressBar: true,
    //       timeOut: 3000,
    //       extendedTimeOut: 1000,
    //   };
    //    toastr.success('Customer added successfully!');
    //     var modal = bootstrap.Modal.getInstance(document.getElementById("addCustomer"));
    //     modal.hide(); // Close modal
    //     window.location.href = `/customers`;
    // })
    // .catch(error => console.error("Error:", error));
});


