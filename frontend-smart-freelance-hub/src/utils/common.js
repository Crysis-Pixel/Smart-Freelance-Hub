export const fetchEx = async (options)=>{
   try{
       const resp = await fetch(options.url, {
           method: options.method,
           headers: {
             'content-type': 'application/json',
             'accept': 'application/json',
             ...options.headers
           },
           body: JSON.stringify(options.body),
         });

         try{
             const data = await resp.json();
             return {
                status: resp.status,
                message: 'Server returned status code ' + resp.status,
                data: data,
             }
         } catch (error) {
            console.log(error)

            return{
                status: resp.status,
                message: 'Json parsing error'
            }
         }


   }
   catch(error)
   {
    console.log(error)
    if (error.response) {
        try{
            const resp = error.response;
            const data = await resp.json();
            return {
               status: resp.status,
               message: 'Server returned status code ' + resp.status,
               data: data,
            }
        } catch (error) {
           return{
               status: resp.status ?? -3,
               message: 'Json parsing error'
           }
        }
    }

    return{
        status: -1,
        message: 'An error occurred'
    }
   }
}