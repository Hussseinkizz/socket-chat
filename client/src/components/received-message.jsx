export const ReceivedMessage = ({ text }) => {
  return (
    <div className="bg-gradient-to-bl from-rose-200 to-teal-200 px-8 py-2 flex justify-self-end self-end gap-4 w-1/4 shadow-md rounded-lg">
      {text}
    </div>
  );
};
