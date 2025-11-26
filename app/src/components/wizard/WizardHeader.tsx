type Props = {
  passos: string[];
  ativo: number;
  setAtivo: (i: number) => void;
};

export default function WizardHeader({ passos, ativo, setAtivo }: Props) {
  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {passos.map((p, i) => (
        <button
          key={i}
          onClick={() => setAtivo(i)}
          className={`px-3 py-1 text-sm rounded 
            ${i === ativo ? "bg-blue-600 text-white" : "bg-white border"}
          `}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
