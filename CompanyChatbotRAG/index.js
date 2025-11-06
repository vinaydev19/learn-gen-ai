import { indexingTheDocu } from "./prepare.js";

const filePath = './cg-internal-docs.pdf'
indexingTheDocu(filePath)












































/*
 implementation plan
 stage 1: indexing
    1. load the document
    2. chunk the docu
    3. generate vecter embedding
    4. store the embedding in vecter db

 stage 2: using the chatbot
    1. setup llm
    2. add retriveal info
    3. pass input + retriveal info to llm
    4. done
*/