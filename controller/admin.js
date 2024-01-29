


var idEdited = null;
function resetForm(){
    var listInput = document.querySelectorAll("input");
    console.log("-list-input", listInput)
    for(var i=0;i<listInput.length;i++){
      listInput[i].value="";
    }
  }

      function renderProducts(productArray) {
        var contentHTML = "";
        for (var i = productArray.length-1; i >= 0; i--) {
          var product = productArray[i];
          var trString = ` <tr>
                              <td>${product.id}</td>
                              <td>${product.name}</td>
                              <td>${product.price}</td>
                              <td>${product.screen}</td>
                              
                              <td>${product.img}</td>
                              
                              <td>${product.type}</td>
                              <td>
      
                              <button
                              onclick=deletProduct(${product.id}) 
                              class="btn btn-danger">Delete</button>
      
                              
                              </td>
                              <td>
                              <button onclick=editProduct(${product.id})
                              class="btn btn-primary">Edit</button></td>
                          </tr>`;
      
          contentHTML = contentHTML + trString;
        }
        document.getElementById("tableDanhSach").innerHTML = contentHTML;
      }

      function fetchProductList() {
        // turnOnLoading();
        axios({
          url: "https://65aebe0f1dfbae409a757980.mockapi.io/phone",
          method: "GET",
        })
          .then(function (res) {
            console.log("😀 - res", res.data);
            // gọi hàm renderProducts sau khi lấy data từ server
            renderProducts(res.data);
            // turnOffLoading();
          })
          .catch(function (err) {
            console.log("😀 - err", err);
            // turnOffLoading()
          });
      }
      fetchProductList();
      

      function deletProduct(id) {
        //   gọi api xoá sp
        // turnOnLoading()
        axios({ url: `https://65aebe0f1dfbae409a757980.mockapi.io/phone/${id}`, method: "DELETE" })
          .then(function (res) {
            // xoá thành công , gọi lại api lấy dssp mới nhất từ server
            fetchProductList();
            console.log("😀 - res", res.data);
          })
          .catch(function (err) {
            // turnOffLoading()
            // xoá thất bại
            console.log("😀 - err", err);
          });
      }

      function createProduct() {
        console.log("yes");
        var tenSp = document.getElementById("tenSP").value;
        var giaSp = document.getElementById("giaSP").value;
        var manHinh= document.getElementById("manHinh").value
        var Camera = document.getElementById("camera").value
        var hinhSP = document.getElementById("hinhSP").value
        var moTaSp = document.getElementById("moTaSP").value
        var loaiSP = document.getElementById("loaiSP").value
        // taoj object mới có key trùng với schema trên server
        var sp={
          name:tenSp,
          price:giaSp,
          screen:manHinh,
          frontCamera:Camera,
          img:hinhSP,
          desc: moTaSp,
          type: loaiSP,
        }
        console.log("cre", sp)
        // gọi api 
        axios({
          url: "https://65aebe0f1dfbae409a757980.mockapi.io/phone",
          method: "POST",
          data: sp,
        })
          .then(function(result){
            //render lại dssp sau khi them sản phẩm thành công
            console.log("-result", result);
            $('#myModal').modal('hide')
            resetForm()
            
          })
          .catch(function(err){
            console.log("",err)
          })
        
      }


      function editProduct(id){
        axios({
          url: `https://65aebe0f1dfbae409a757980.mockapi.io/phone/${id}`,
          method: "GET"
        
        })
          .then(function(res){
            idEdited=id
            //render lại dssp sau khi them sản phẩm thành công
            console.log("lay thong tin thanh cong", res.data)
            $('#myModal').modal('show')
            var sp= res.data
            // var arrinput = document.querySelectorAll(form in)
            // document.getElementById("GiaSp")
            

            document.getElementById("tenSP").value=sp.name;
            document.getElementById("giaSP").value=sp.price;
            document.getElementById("manHinh").value=sp.screen
            document.getElementById("camera").value=sp.frontCamera
            document.getElementById("hinhSP").value=sp.img
            document.getElementById("moTaSP").value=sp.desc
            document.getElementById("loaiSP").value=sp.type
          })
          .catch(function(err){
            console.log("",err)
          })
      }


      function updateProduct(id){
        // idEdited=id
        var tenSp = document.getElementById("tenSP").value;
        var giaSp = document.getElementById("giaSP").value;
        var manHinh= document.getElementById("manHinh").value
        var Camera = document.getElementById("camera").value
        var hinhSP = document.getElementById("hinhSP").value
        var moTaSp = document.getElementById("moTaSP").value
        var loaiSP = document.getElementById("loaiSP").value
        // taoj object mới có key trùng với schema trên server
        var sp={
          name:tenSp,
          price:giaSp,
          screen:manHinh,
          frontCamera:Camera,
          img:hinhSP,
          desc: moTaSp,
          type: loaiSP,
        }
        axios({
          url: `https://659c0428d565feee2dac441e.mockapi.io/product/${idEdited}`,
          method: "PUT",
          data: sp,
        })
          .then(function (res) {
            // update thành công
            // tắt modal
            $("#myModal").modal("hide");
            // render ddsp
            fetchProductList();
          })
          .catch(function (err) {});
      }
      function backup(){
       
      }