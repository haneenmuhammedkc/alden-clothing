const Loader = ({ size = 20 }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="rounded-full bg-[#c6c6c6] animate-[pulseDot_1.5s_ease-in-out_infinite]"
            style={{
              width: size,
              height: size,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Loader