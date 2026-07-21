import React from "react";
import { Loader } from "..";

export function FormButton({status = "", text = "Submit", type = "submit"}) {
  return (
    <button
      disabled={status === "loading"}
      type={type}
      className="w-full py-2 rounded-full text-white font-semibold transition cursor-pointer bg-[var(--primary-color)]"
    >
      {status === "loading" ? <Loader /> : text}
    </button>
  );
}
