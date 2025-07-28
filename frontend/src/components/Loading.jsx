const Loading = () => {
 return (
    <div className="flex justify-center items-center min-h-[120px]">
      <div
        className="
          animate-spin 
          rounded-full 
          h-16 w-16 
          border-4 
          border-t-8 
          border-t-indigo-500 
          border-indigo-300
          border-b-indigo-700
          border-b-4
          shadow-lg
        "
      />
    </div>
  )
}

export default Loading
