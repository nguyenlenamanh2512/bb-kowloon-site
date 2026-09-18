import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/data/projects";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article id={project.slug} className={`project-card ${featured ? "project-card--featured" : ""}`}>
      <div className="project-card__image">
        <img src={project.image} alt={`${project.title} cargo operation`} loading="lazy" />
      </div>
      <div className="project-card__body">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h3>{project.title}</h3>
        </div>
        <ArrowUpRight aria-hidden="true" />
        <p>{project.summary}</p>
        {project.route ? <span>{project.route}</span> : null}
      </div>
    </article>
  );
}
