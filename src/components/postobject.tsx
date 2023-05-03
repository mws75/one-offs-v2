export const PostObject = (props: { postTitle: string }) => {
  return (
    <div className="mb-4 rounded-lg bg-slate-100 p-4 shadow-md hover:bg-slate-300">
      {props.postTitle}
    </div>
  );
};

export default PostObject;
