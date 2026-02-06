type Props = {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
};

export default function TutorialDocDetailLayout({ left, center, right }: Props) {
  return (
    <>
      <section className="grid gap-8 lg:hidden">{left}</section>

      <section className="grid gap-8 lg:grid-cols-[15.5rem_minmax(0,1fr)_13.5rem] lg:items-start lg:gap-4 xl:gap-5">
        <div className="hidden lg:block" aria-hidden="true" />
        <div className="min-w-0">{center}</div>
        <div className="hidden lg:block" aria-hidden="true" />
      </section>

      <section className="grid gap-8 lg:hidden">{right}</section>

      <div className="hidden lg:block">
        <div className="fixed left-[max(2rem,calc((100vw-88rem)/2+2rem))] top-[7.55rem] w-[15.5rem] max-h-[calc(100vh-10.25rem)] overflow-y-auto xl:left-[max(3rem,calc((100vw-88rem)/2+3rem))]">
          {left}
        </div>
        <div className="fixed right-[max(2rem,calc((100vw-88rem)/2+2rem))] top-[7.55rem] w-[13.5rem] max-h-[calc(100vh-10.25rem)] overflow-y-auto xl:right-[max(3rem,calc((100vw-88rem)/2+3rem))]">
          {right}
        </div>
      </div>
    </>
  );
}
