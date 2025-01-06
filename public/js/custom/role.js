document.getElementById('roleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const roleName = formData.get('roleName');
    
    const permissions = [];
    for (let pair of formData.entries()) {
      if (pair[0].startsWith('permissions')) {
        const [, index, key] = pair[0].match(/permissions\[(\d+)]\[(\w+)]/);
        if (!permissions[index]) permissions[index] = { table: '', actions: [] };
  
        if (key === 'table') permissions[index].table = pair[1];
        else if (key === 'actions') permissions[index].actions.push(pair[1]);
      }
    }
  
    const data = { roleName, permissions };
    try {
      const response = await fetch('/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      if (response.ok) {
          toastr.options = {
              closeButton: false,
              progressBar: true,
              timeOut: 6000,
              extendedTimeOut: 1000,
          };
          toastr.success('Role Created Successfully');
          // setTimeout(() => window.location.reload(), 5000);
            // Clear form inputs
            e.target.reset(); 
      } else {
          toastr.options = {
              closeButton: false,
              progressBar: true,
              // timeOut: 5000,
              extendedTimeOut: 1000,
          };
          toastr.error('Failed to Create Role');
      }
  } catch (error) {
      toastr.options = {
          closeButton: true,
          progressBar: true,
          // timeOut: 5000,
          extendedTimeOut: 1000,
      };
      toastr.error('An Error Occurred');
  }
  });

