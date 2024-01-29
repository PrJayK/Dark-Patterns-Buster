const { BLOCK_ELEMENTS, INLINE_ELEMENT, NODE_TYPES }=require("../html ");
module.exports= class PageSegment{
    #page
    #IGNORE_ELEMENTS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR', 'HR'];
    constructor(page){
        this.page=page
    } 
    async pageSegmentation(page){
        return await this.#elementSegmentation(await this.page.$('body'))
    }
    async #elementSegmentation(element){
        if(!element){
            return []
        }
        if(!(await this.#childNodeIgnoredElements(element))){
            if(await this.#childNodeTextNodeorInline(element)){
                const text=await this.#getTextContent(element)
                if(text){
                    return [text]
                }
            }
        }
        const childNodes=await this.#getChildNodes(element)
        let texts=[]
        for(const child of childNodes){
            const nodetype=await this.#getNodeType(child)
            if(nodetype==NODE_TYPES.TEXT_NODE){
                const textContent=await this.#getTextContent(child)
                texts.push(textContent)
            }
            const tagName=await this.#getTagName(child)
            if((!tagName)||this.#IGNORE_ELEMENTS.includes(tagName.toUpperCase())){
                continue
            } 
            if(tagName.toUpperCase() in BLOCK_ELEMENTS){
                texts=texts.concat(await this.#elementSegmentation(child))
            }
            if(tagName.toUpperCase() in INLINE_ELEMENT){
                const textContent=await this.#getTextContent(child)
                if(textContent){
                 texts.push(textContent)
                }
            }
        }
        return texts      
    }
    async #childNodeIgnoredElements(element){
        const childNodes=await this.#getChildNodes(element)
        for(const child of childNodes){
            const tagName=await this.#getTagName(child)
            if(tagName==null){
                continue
            }
            if(this.#IGNORE_ELEMENTS.includes(tagName.toUpperCase())){
                return true
            }
        }
        return false
    }
    async #childNodeTextNodeorInline(element){
        const childNodes=await this.#getChildNodes(element)
        for(const child of childNodes){
            const tagName= await this.#getTagName(child)
            const nodetype=await this.#getNodeType(child)
            if(tagName==null){
                if( nodetype!==NODE_TYPES.TEXT_NODE){
                    return false
                }
            }
            else if(!(nodetype==NODE_TYPES.TEXT_NODE||tagName in INLINE_ELEMENT)){
                return false
            }
        }
        return true
    }
    
    async #getChildNodes(element){
        const listHandle = await this.page.evaluateHandle((e) => {
            return e.childNodes;
        }, element);
        const properties = await listHandle.getProperties();
        const childNodes = [];
        for (const property of properties.values()) {
            const element = property.asElement();
            childNodes.push(element);
        }
        return childNodes;
    }
    async #getTextContent(element){
        const textContent=  await ( await element?.getProperty('textContent'))?.jsonValue()
        return textContent  
    }
    async #getNodeType(element){
        return await (await element?.getProperty('nodeType'))?.jsonValue();
    }
    async #getTagName(element){
        return await (await element?.getProperty('tagName'))?.jsonValue();
    }
}