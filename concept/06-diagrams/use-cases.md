# Diagrama de Casos de Uso

O diagrama abaixo organiza as funcionalidades do sistema por tipo de actor. O **Leitor** é um utilizador autenticado com `role = LEITOR`; o **Administrador** é um utilizador com `role = ADMIN`. O visitante não autenticado tem acesso apenas a registo, login e pré-visualização.

```mermaid
flowchart TD
    subgraph Atores
        L[Leitor]
        A[Administrador]
        V["Visitante (não autenticado)"]
    end

    subgraph Casos de Uso
        UC1["Registar-se no sistema"]
        UC2["Fazer login"]
        UC3["Visualizar pré-visualização da revista"]
        UC4["Comprar revista"]
        UC5["Enviar comprovativo de pagamento"]
        UC6["Visualizar revista completa"]
        UC7["Criar comentário"]
        UC8["Responder a comentário"]
        UC9["Editar/eliminar próprio comentário"]
        UC10["Ver histórico de compras"]
        UC11["Gerir perfil"]
        UC12["Publicar nova revista"]
        UC13["Editar metadados de revista"]
        UC14["Eliminar revista (soft delete)"]
        UC15["Listar pagamentos pendentes"]
        UC16["Aprovar/rejeitar pagamento"]
        UC17["Moderar comentários (eliminar qualquer um)"]
        UC18["Visualizar estatísticas básicas"]
    end

    V --> UC1
    V --> UC2
    V --> UC3

    L --> UC4
    L --> UC5
    L --> UC6
    L --> UC7
    L --> UC8
    L --> UC9
    L --> UC10
    L --> UC11

    A --> UC12
    A --> UC13
    A --> UC14
    A --> UC15
    A --> UC16
    A --> UC17
    A --> UC18

    UC4 -.->|"include (após pagamento aprovado)"| UC6
    UC5 -.->|"extend (aciona validação manual)"| UC16