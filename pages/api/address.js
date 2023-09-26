import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Address } from "@/models/Address";

export default async function handle(req, res) {
  await mongooseConnect();
  if (req.method === "PUT") {
    // {
    //     user: {
    //       name: 'Hunter',
    //       email: 'an3068783@gmail.com',
    //       image: 'https://lh3.googleusercontent.com/a/AAcHTteIV14Xa2_AjGwg82we4YNXGTeSYzVQkZT8qKDH2mfWcw=s96-c'
    //     },
    //     expires: '2023-10-18T10:26:56.376Z'
    //   }
      const { user } = await getServerSession(req, res, authOptions);
      const address = await Address.findOne({ userEmail: user.email })
      if (address) {
          res.json(await Address.findByIdAndUpdate(address._id ,req.body))
      } else {
        res.json(await Address.create({ userEmail: user.email  , ...req.body}))
      }
  }

    if (req.method === "GET") {
        const session = await getServerSession(req, res, authOptions);
        
 
        if (session) {
            const address = await Address.findOne({ userEmail: session.user.email });
         
            res.json(address)
        }
       
      
  }
}
