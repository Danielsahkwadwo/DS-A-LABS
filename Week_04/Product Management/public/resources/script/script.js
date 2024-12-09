const deleteProduct = async function (id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirmDelete) {
    return;
  }
  await fetch(`/products/deleteProduct/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data);
      if (data.status === "success") {
        window.location.href = "/dashboard/products";
      }
      if (data.status === "failed") {
        console.log("an error occured while deleting product");
      }
    })
    .catch((err) => console.log(err));
};
