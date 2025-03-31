
import { defineStore } from 'pinia';
import axios from 'axios';

// 注意更改store名字，避免冲突
export const useContentInfoStore :any= defineStore('contentInfo', {
  state: () => ({
    content_id :0,
    user_id: 0,
    created_at: '',
    updated_at: '',
    title: '',
    subtitle: '',
    text_content: '',
    image_url: '',
  }),
  actions: {
    async getContentInfo(content_id:string) {

      const {data} = await axios.get(`http://localhost:4000/getContents/${content_id}`)
      this.content_id = data[0].content_id
      this.user_id = data[0].user_id
      this.created_at = data[0].created_at
      this.updated_at = data[0].updated_at
      this.title = data[0].title
      this.subtitle = data[0].subtitle
      this.text_content = data[0].text_content
      this.image_url = data[0].image_url
      console.log(data[0])
      console.log(this.image_url)
      return data
    },

    async submitCommits(formData:any) {
      const {data} = await axios.post(`http://localhost:4000/submitCommits`,{
        formData
      })
      console.log(data.data)
      console.log(data.comment)
      return data
    }
  },
  persist: true, // 持久化存储
});