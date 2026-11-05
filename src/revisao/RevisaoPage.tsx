import { ExternalLink } from "./ExternalLink";
import { Greetings } from "./Greetings";

export function RevisaoPage() {
  return (
    <>
      <div className="grid">
        <Greetings name="Joao" />
        <Greetings
          name="Jose"
          excited
          onGreet={(name) => console.log("Greet : ", name)}
        >
          {" "}
          <h5>Children: qualqer react node</h5>{" "}
        </Greetings>
        <ExternalLink href="https://react.dev" title="Documentação oficial">
          react.dev
        </ExternalLink>
        <ExternalLink href="https://www.typescriptlang.org" className="price">
          typescriptlang.org
        </ExternalLink>
      </div>

      {/*  <Greetings /> */}
      {/* <Greetings name={42} /> */}
      {/* <ExternalLink>sem href</ExternalLink> */}
    </>
  );
}
