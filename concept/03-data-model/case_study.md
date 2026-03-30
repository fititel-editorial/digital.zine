Estudo de caso para a modelagem de dados do Back-end do "site" da Revista FITITEL.

# Estudo de caso: Revista FITITEL Digital

O ITEL pretende digitalizar a revista da FITITEL para levar a sua feira de inovação a um novo patamar. O foco é construir 
um sistema robusto e veloz, capaz de gerir grandes volumes de dados e garantir respostas imediatas aos utilizadores.

O site da Revista, deverá lidar essencialmente com as **revistas** e os **leitores**. No sistema, cada leitor poderá ter
o seu nome completo, data de nascimento, email, género, palavra-passe e um identificador único. As revistas, possuem um nome, data de
lançamento, edição, URL do Pdf da revista, autores, preço, quantidade de páginas, tema da edição e o lema da referida edição.
Sobre as **páginas**, é importante saber o número e o nome do projeto (se houver).O sistema, deverá ainda permitir o **pagamento**
das revistas e cada leitores, só poderá ler a revista inteira se efetuar o 
referido pagamento. Cada pagamento possui um identificador único, método de pagamento, data de pagamento, URL do comprovante,
estado do pagamento(ex: pendente, em análise, aprovado e rejeitado) e um token de acesso à revista.
Haverá ainda os **administradores**, que serão os responsáveis por adicionar as revistas ao sistema. Cada administrador, deverá
possuir todos os elementos dos leitores. Os leitores, podem ainda fazer **comentários** em páginas específicas da revista.
Cada comentário possui um texto e data de efetividade do comentário.

Um leitor, pode fazer o pagamento de muitas revistas, e, ao mesmo tempo, uma revista pode ser paga por vários leitores.
Uma única página pertence a uma revista, no entanto, uma revista, pode ter múltiplas páginas. Ainda sobre as revistas,
é importante referir que um leitor pode fazer comentários sobre muitas páginas, logo, uma página pode ser comentada por
vários leitores. Os leitores poderão ainda responder aos outros comentários. Sabe-se que, os administradores, podem adicionar
revistas ao sistema. Cada admin poderá adicionar várias revistas, mas, uma revista só pode ser adicionada por um único administrador.