const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://admin-pranay:013051@cluster0.9cegs.mongodb.net/blogsDB");

const blogSchema = mongoose.Schema(({
    title: String,
    author: String,
    content: String
}));

const Blog = mongoose.model("blog",blogSchema);

const home = new Blog({
    title: "Home",
    content: "Whenever you read a blog post, you've consumed content from a thought leader in their field. You are likely to come away from a blog post with useful knowledge and a positive opinion of the author or brand who wrote it. By blogging, anyone can connect with their audience and benefit from the myriad benefits it offers: organic traffic from search engines, promotional content for social media, and recognition from an audience you haven't reached yet."
})

const aboutContent = "I'm Web Developer and student at VIIT Pune. I love coding and travelling. To apply my computer science skills and my experience in developing custom software for a variety of clients to a position as a Software Developer in a fast-paced technical environment. ";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", (req, res) => {
    Blog.find({},(err,blogs) =>{
        res.render("home", { home, blogs});
    })
    
})

app.get("/blogs/:blog", (req, res) => {
    const requstedTitle = req.params.blog;

    Blog.findOne({_id:requstedTitle},(err,foundBlog)=>{
        res.render("blog",{foundBlog});
    })
        
    
})

app.get("/:id", (req, res) => {
    switch (req.params.id) {
        case "about":
            res.render("about", { aboutContent });
            break;
        case "contact":
            res.render("contact", { contactContent });
            break;
        case "compose":
            res.render("compose");
            break;

        default:
            res.redirect("/");
            break;
    }
});


app.post("/compose", (req, res) => {
    const blogTitle = _.capitalize(req.body.blogTitle);
    const blogAuthor = _.capitalize(req.body.author)
    const blogContent = req.body.blogBody;
    if(blogContent!=="" && blogTitle!==""){
    const blog = new Blog({
        title: blogTitle,
        author: blogAuthor,
        content: blogContent
    })
    blog.save((err)=>{
        if(err)
        console.log(err);
        else
        res.redirect("/");
    });
    }
    else{
    res.redirect("/compose");
}
})

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
});

