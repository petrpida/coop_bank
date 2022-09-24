
export default function Summary({ data }) {
    return (
    <div className={"mt-5 d-flex flex-column justify-content-between align-items-center"}>
        <h3 className={"mb-5"}>Děkujeme za důvěru projevenou naší bance</h3>
        <h4>stav Vaší žádosti můžete sledovat na této adrese:</h4>
        <div><a href={`http://localhost:3000/${data.id}`}>{`http://localhost:3000/${data.id}`}</a></div>

        <h3 className={"mt-5 mb-3"}>{`Jméno žadatele: ${data.name} ${data.surname}`}</h3>
        <h5>{`žádost vytvořena ${data.created} je ve stavu:`}</h5>
        <h2>{data.status}</h2>
    </div>
    )
}