

let cartCounter = document.getElementById('cartCounter')
let reset = document.querySelector('.reset-cart')

     function myAxios(method , url, body = null){

        const headers = {
            'Content-Type' : 'application/json' 
        }
        return fetch(url, {
            method : method,
            headers : headers,
            body : JSON.stringify(body)
        }).then(res => res.json())
    }

    function updateCart(product){
            myAxios('POST' , '/update-cart' , product).then(res =>{
                console.log(res)
                cartCounter.innerText = res.totalQty

            }).catch(err =>{
                console.log('Error')
            })

    }







let cartButton = document.querySelectorAll('.add-to-cart')

cartButton.forEach(btn =>{
    btn.addEventListener('click' , () =>{
        const product = JSON.parse(btn.dataset.product)
        
        updateCart(product)
    })
})

