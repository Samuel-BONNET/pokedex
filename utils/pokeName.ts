export function getName(id: string){
    const [premier] = id.split(':')

    switch(premier){
        case "mrmime":
            return "mr-mime"
        case "nidoranm":
            return "nidoran-m"
        case "nidoranf":
            return "nidoran-f"
        default:
            return premier
    }
}