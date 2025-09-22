import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ShieldCheck, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import logo from '../assets/paypal-blue.png'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Success = () => {
    const [counter, setCounter] = useState<number>(120);

    useEffect(() => {
        const intervalID = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalID)
                    return 0;
                }
                return prev - 1
            })

        }, 1000)
        return () => clearInterval(intervalID)
    }, [])

    return (
        <div className='px-[15px] sm:px-[0] '>
            <Card className='w-full max-w-sm m-auto'>
                <CardHeader>
                    <CardTitle>Transaction in Progress, Do not refresh page</CardTitle>
                    <CardDescription>Hang in there, this might take 1 to 2 minutes</CardDescription>
                </CardHeader>
                <CardContent>
                    <DotLottieReact
                        src={counter === 0? "/animations/IconFailed.lottie" : "/animations/MoneyTransfer.lottie"}
                        loop = {counter != 0}
                        autoplay
                        className={counter == 0? "w-[250px] m-auto" : "w-full m-auto"}
                    />
                </CardContent>
                <CardFooter className='flex flex-col gap-3'>
                    <p className='flex gap-1 justify-center items center w-full'>
                        <b>{counter} s </b>
                        <Timer />
                    </p>
                    {counter == 0 && <p className='text-red-500' > Transaction failed</p>}

                </CardFooter>

            </Card>
            <span className='flex items-center gap-1 justify-center mt-6'>    
                <ShieldCheck />
                <small>Secured by </small>
                <img src={logo} alt="" width={80} />
            </span>
        </div>
    )
}

export default Success