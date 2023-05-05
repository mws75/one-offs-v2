export const PostObject = (props: { postTitle: string }) => {
  return (
    <div className="w-120 mb-5 h-40 w-72 rounded-lg bg-slate-100 p-4 shadow-md hover:bg-slate-300">
      {props.postTitle}
    </div>
  );
};

export default PostObject;
