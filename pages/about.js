export default function About() {
    return (
    <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Our Team
        </h1>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-start space-x-8 mb-12">
          <div className="self-center flex-shrink-0">
            <img 
              src="/shelly.png" 
              alt="shelly" 
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="flex-grow flex flex-col">
            <h2 className="text-3xl font-bold mb-1">
              Shelly Trifonov
            </h2>
            <span className="font-bold">Email: Shellytrifonov1@gmail.com</span>
            <p className="text-lg mt-2">Shelly, 24, from Kiryat Haim, is the team’s Product Manager and a fourth-year software engineering student. She oversees the website’s development process, ensuring that features align with user needs and project goals.</p>
          </div>
        </div>
        <div className="flex items-start space-x-8 mb-12">
          <div className="self-center flex-shrink-0">
            <img 
              src="/maor.jpeg" 
              alt="Maor" 
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="flex-grow flex flex-col">
            <h2 className="text-3xl font-bold mb-1">
              Maor Tzur
            </h2>
            <span className="font-bold">Email: Maortz42@gmail.com</span>
            <p className="text-lg mt-2">Maor, 28, from Nahariya, is the team’s DevOps engineer and a fourth-year software engineering student. He ensures the website operates smoothly and efficiently, focusing on system optimization and high performance.</p>
          </div>
        </div>
        <div className="flex items-start space-x-8 mb-12">
          <div className="self-center flex-shrink-0">
            <img 
              src="/guy.jpeg" 
              alt="guy" 
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="flex-grow flex flex-col">
            <h2 className="text-3xl font-bold mb-1">
              Guy Naeh
            </h2>
            <span className="font-bold">Email: Guylay12@gmail.com</span>
            <p className="text-lg mt-2">Guy, 27, from Adi, is a skilled backend developer and a fourth-year software engineering student. He focuses on building and maintaining server-side infrastructure, ensuring the website operates efficiently and reliably.</p>
          </div>
        </div>
        <div className="flex items-start space-x-8 mb-12">
          <div className="self-center flex-shrink-0">
            <img 
              src="/yuval.png" 
              alt="yuval" 
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="flex-grow flex flex-col">
            <h2 className="text-3xl font-bold mb-1">
              Yuval Shahar
            </h2>
            <span className="font-bold">Email: Yuvals751@gmail.com</span>
            <p className="text-lg mt-2">Yuval, 27, from Haifa, is the team’s Database Administrator and a third-year software engineering student. He manages and optimizes database systems, ensuring seamless storage, retrieval, and organization of the website’s data.</p>
          </div>
        </div>
        <div className="flex items-start space-x-8 mb-12">
          <div className="self-center flex-shrink-0">
            <img 
              src="/liroy.png" 
              alt="liroy" 
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="flex-grow flex flex-col">
            <h2 className="text-3xl font-bold mb-1">
              Liroy Ben Shimon
            </h2>
            <span className="font-bold">Email: Bsliroy178@gmail.com</span>
            <p className="text-lg mt-2">Liroy, 24, from Kiryat Ata, is the team’s Full Stack Developer and a third-year software engineering student. He works on both front-end and back-end development, ensuring a seamless and efficient user experience across the website.</p>
          </div>
        </div>
      </div>
    </div>
    );
  }