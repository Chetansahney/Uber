import { Link } from 'react-router-dom';


const start = () => {
  return (
    <div className="h-screen w-full relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('/Uberbg.png')" }}
      ></div>

      <div className='relative z-10 h-screen w-full flex flex-col justify-between pt-10'>
        <div className='px-10'>
          <img 
            className='w-14' 
            src="/Uber_logo_2018.png" 
            alt="Uber Logo" 
          />
        </div>

        <div className='bg-white w-full rounded-t-3xl flex flex-col items-center justify-center gap-5 py-8 px-10 shadow-2xl'>
            <h2 className='text-2xl font-bold text-center'>
                Get Started with Uber
            </h2>
            <Link to='/Userlogin' className='flex items-center justify-center bg-black text-white py-4 rounded-lg w-full text-lg font-semibold hover:bg-gray-900 transition-colors'>
                Continue
            </Link>
        </div>
      </div>
    </div>
  );
}

export default start;