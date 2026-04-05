import './App.css'
import { useState, useEffect, useRef } from 'react';
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import img3 from "./assets/img3.png";
import img4 from "./assets/img4.png";
import img5 from "./assets/img5.png";

const Images = [img1, img2, img3, img4, img5, img1, img2, img3, img4, img5];

function Transition({ initialIndex, delay }: { initialIndex: number; delay: number }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [crossfading, setCrossfading] = useState(false);
  const currentIndexRef = useRef(initialIndex);

  useEffect(() => {
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        let next = currentIndexRef.current;
        while (next === currentIndexRef.current) {
            next = (currentIndexRef.current + 1) % Images.length;
        }

        setNextIndex(next);

        setTimeout(() => {
          setCrossfading(true);

          setTimeout(() => {
            currentIndexRef.current = next;
            setCurrentIndex(next);
            setNextIndex(null);
            setCrossfading(false);
          }, 800);
        }, 50);

      }, 5000);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(start);
  }, []);

  return (
    <div className="relative w-full h-full">
      <img
        src={Images[currentIndex]}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {nextIndex !== null && (
        <img
          src={Images[nextIndex]}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: crossfading ? 1 : 0,
            transition: crossfading ? 'opacity 0.8s ease-in-out' : 'none',
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <div className='space-y-2 px-4 md:px-6 pt-6'>
        <div className="w-24 h-8 relative bg-white/0 rounded-md outline outline-1 outline-offset-[-1px] outline-black overflow-hidden">
          <div className="w-20 h-2.5 left-[7px] top-[10px] absolute text-center justify-center text-black text-base font-semibold font-['Manrope'] leading-4">Gallery</div>
        </div>
        <div className='text-left font-manrope font-bold text-4xl md:text-6xl'>Gallery</div>
        <div className='text-left font-inter text-sm md:text-base'>The students behind our mission</div>
      </div>

      <div className="w-full p-4 md:p-6">

        <div className="flex flex-col gap-3 md:hidden">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden h-56">
              <Transition initialIndex={i} delay={i * 600} />
            </div>
          ))}
        </div>

        <div className="hidden md:grid lg:hidden grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden h-56">
              <Transition initialIndex={i} delay={i * 600} />
            </div>
          ))}
          <div className="col-span-2 rounded-2xl overflow-hidden h-56">
            <Transition initialIndex={4} delay={4 * 600} />
          </div>
        </div>

        <div
          className="hidden lg:grid w-full gap-2"
          style={{
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(5, minmax(80px, 1fr))",
            height: "85vh",
          }}
        >
          <div className="rounded-2xl overflow-hidden" style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }}>
            <Transition initialIndex={0} delay={0} />
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ gridColumn: "3 / 5", gridRow: "1 / 4" }}>
            <Transition initialIndex={1} delay={600} />
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ gridColumn: "5 / 7", gridRow: "1 / 4" }}>
            <Transition initialIndex={2} delay={1200} />
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ gridColumn: "1 / 3", gridRow: "3 / 6" }}>
            <Transition initialIndex={3} delay={1800} />
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ gridColumn: "3 / 7", gridRow: "4 / 6" }}>
            <Transition initialIndex={4} delay={2400} />
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
