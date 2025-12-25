/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, onWillStart, onMounted } from "@odoo/owl";

export class TodoDashboard extends Component {
    static template = "todo_app.Dashboard";

    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        this.notification = useService("notification");
        
        this.state = useState({
            total: 0,
            done: 0,
            pending: 0,
            by_priority: { alta: 0, media: 0, baja: 0 },
            completion_rate: 0,
            loading: true,
        });

        onWillStart(async () => {
            await this.loadDashboardData();
        });

        onMounted(() => {
            this.renderChart();
        });
    }

    async loadDashboardData() {
        try {
            const data = await this.orm.call("todo.task", "get_dashboard_data", []);
            Object.assign(this.state, data, { loading: false });
        } catch (error) {
            console.error("Error cargando dashboard:", error);
            this.state.loading = false;
        }
    }

    renderChart() {
        // Chart.js desde CDN ya está disponible en Odoo
        const canvas = document.getElementById('priorityChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destruir chart anterior si existe
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Alta', 'Media', 'Baja'],
                datasets: [{
                    data: [
                        this.state.by_priority.alta,
                        this.state.by_priority.media,
                        this.state.by_priority.baja
                    ],
                    backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    // Acción: Ir a lista de tareas
    openTasks(domain = []) {
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: 'Tareas',
            res_model: 'todo.task',
            view_mode: 'list,form',
            views: [[false, 'list'], [false, 'form']],
            domain: domain,
            target: 'current',
        });
    }

    openPending() {
        this.openTasks([['is_done', '=', false]]);
    }

    openDone() {
        this.openTasks([['is_done', '=', true]]);
    }

    openHighPriority() {
        this.openTasks([['priority', '=', '2']]);
    }

    // Confetti cuando completion_rate >= 100%
    celebrate() {
        // Usamos confetti-js simple con canvas
        this.notification.add("🎉 ¡Felicidades! Todas las tareas completadas", {
            type: "success",
            sticky: false,
        });
        this.launchConfetti();
    }

    launchConfetti() {
        const canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 6 + 2,
                d: Math.random() * 150,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.random() * 10 - 5,
                tiltAngle: 0,
                tiltAngleIncrement: Math.random() * 0.1 + 0.05
            });
        }

        let animationFrame;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                ctx.beginPath();
                ctx.fillStyle = p.color;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                p.y += Math.cos(p.d) + 3;
                p.x += Math.sin(p.tiltAngle) * 2;
                p.tiltAngle += p.tiltAngleIncrement;

                if (p.y > canvas.height) {
                    particles[i].y = -10;
                    particles[i].x = Math.random() * canvas.width;
                }
            });
            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            canvas.remove();
        }, 4000);
    }

    async createQuickTask() {
        const name = prompt("Nombre de la nueva tarea:");
        if (name) {
            await this.orm.create("todo.task", [{ name, priority: '1' }]);
            this.notification.add(`Tarea "${name}" creada`, { type: "success" });
            await this.loadDashboardData();
            this.renderChart();
        }
    }

    async refresh() {
        this.state.loading = true;
        await this.loadDashboardData();
        this.renderChart();
        this.notification.add("Dashboard actualizado", { type: "info" });
    }
}

registry.category("actions").add("todo_dashboard_action", TodoDashboard);