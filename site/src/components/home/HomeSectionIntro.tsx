type HomeSectionIntroProps = {
  title: string;
  description: string;
};

export default function HomeSectionIntro({
  title,
  description,
}: HomeSectionIntroProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
